import { randomUUID } from "node:crypto";
import { test, expect, type APIRequestContext, type Page } from "@playwright/test";
import { Pool } from "pg";

const marker = `BROWSER-${randomUUID()}`;
let pool: Pool;

test.beforeAll(async ({ request }) => {
  if (process.env.ALLOW_TEST_WRITES !== "1" || !process.env.TEST_DATABASE_URL || !process.env.TEST_BASE_URL) throw new Error("Browser tests require explicit isolated test database and local TEST_BASE_URL.");
  const url = new URL(process.env.TEST_DATABASE_URL);
  const base = new URL(process.env.TEST_BASE_URL);
  if (!/test/i.test(url.pathname) || !["postgres:", "postgresql:"].includes(url.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Browser test safety guard refused database/server.");
  const identity = (value: string) => { const u = new URL(value); return `${u.hostname}:${u.port || "5432"}${u.pathname}`; };
  for (const protectedUrl of [process.env.DEMO_DATABASE_URL, process.env.PRODUCTION_DATABASE_URL]) if (protectedUrl && identity(protectedUrl) === identity(url.href)) throw new Error("Browser tests refused protected database.");
  pool = new Pool({ connectionString: url.href });
  const probe = await pool.query<{id: string}>(`insert into return_requests
    (customer_name, customer_email, order_reference, item_identifier, item_name, quantity, reason)
    values ($1,'browser@example.com',$2,'BROWSER-PROBE','Browser connection probe',1,'DAMAGED') returning id`,
    [marker, `PROBE-${randomUUID()}`]);
  const fetched = await request.get(`/api/requests/${probe.rows[0].id}`);
  expect(fetched.status(), "Server must use the isolated test database before browser writes").toBe(200);
  expect((await fetched.json()).data.customerName).toBe(marker);
});
test.afterAll(async () => { await pool?.end(); });

async function create(request: APIRequestContext, extra = {}) {
  const token = randomUUID();
  const response = await request.post("/api/requests", { data: { customerName: `${marker}-${token}`, customerEmail: "browser@example.com", customerPhone: null, orderReference: `BROWSER-${token}`, itemIdentifier: "BROWSER-SKU", itemName: "Comfort cushion", quantity: 1, reason: "DAMAGED", ...extra } });
  expect(response.status()).toBe(201);
  return (await response.json()).data as {id: string; reference: string; customerName: string; orderReference: string; version: number};
}
async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "Page must fit viewport without horizontal scrolling").toBe(true);
}

test("queue searches a real record and fits the viewport", async ({ page, request }) => {
  const row = await create(request);
  await page.goto("/");
  await page.getByLabel("Search requests").fill(row.customerName);
  await expect(page.getByRole("link", {name: new RegExp(`^${row.reference}(?:\\s|$)`)})).toBeVisible();
  await expect(page).toHaveURL(/q=/);
  await noHorizontalOverflow(page);
  await page.getByRole("link", {name: new RegExp(`^${row.reference}(?:\\s|$)`)}).click();
  await expect(page.getByRole("heading", {name: new RegExp(`^${row.reference}(?:\\s|$)`)})).toBeVisible();
  await noHorizontalOverflow(page);
});

test("create form persists customer and order details", async ({ page }) => {
  const token = randomUUID();
  await page.goto("/requests/new");
  await page.getByLabel("Customer name", {exact: true}).fill(`Browser customer ${token}`);
  await page.getByLabel("Email address", {exact: true}).fill("care@example.com");
  await page.getByLabel("Order reference", {exact: true}).fill(`FORM-${token}`);
  await page.getByLabel("Item identifier / SKU", {exact: true}).fill("FORM-SKU");
  await page.getByLabel("Item name", {exact: true}).fill("Support pillow");
  await page.getByLabel("Quantity", {exact: true}).fill("2");
  await page.getByLabel("Reason for return", {exact: true}).selectOption("SIZE_ISSUE");
  await noHorizontalOverflow(page);
  await page.getByRole("button", {name: "Create request"}).click();
  await expect(page).toHaveURL(/\/requests\/[0-9a-f-]{36}$/);
  await expect(page.getByText(`FORM-${token}`, {exact: true})).toBeVisible();
  await page.reload();
  await expect(page.getByText(`FORM-${token}`, {exact: true})).toBeVisible();
  await noHorizontalOverflow(page);
});

test("approval fields clear on resolution changes and only legal actions remain", async ({page, request}) => {
  const row = await create(request);
  const reviewed = await request.post(`/api/requests/${row.id}/transitions`, {data: {expectedVersion: row.version, toStatus: "IN_REVIEW"}});
  expect(reviewed.status()).toBe(200);
  await page.goto(`/requests/${row.id}`);
  await expect(page.getByRole("button", {name: "Start review", exact: true})).toHaveCount(0);
  await page.getByRole("button", {name: "Approve request", exact: true}).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Refund amount (INR)", {exact: true}).fill("1499.50");
  await dialog.getByLabel("Resolution", {exact: true}).selectOption("REPLACEMENT");
  await expect(dialog.getByLabel("Refund amount (INR)", {exact: true})).toHaveCount(0);
  await dialog.getByLabel("Resolution", {exact: true}).selectOption("REFUND");
  await expect(dialog.getByLabel("Refund amount (INR)", {exact: true})).toHaveValue("");
  await dialog.getByLabel("Refund amount (INR)", {exact: true}).fill("1499.50");
  await dialog.getByRole("button", {name: "Confirm approval", exact: true}).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", {name: "Mark completed", exact: true})).toBeVisible();
  await expect(page.getByRole("button", {name: "Edit details", exact: true})).toHaveCount(0);
  await expect(page.getByRole("button", {name: "Approve request", exact: true})).toHaveCount(0);
  await page.getByRole("button", {name: "Mark completed", exact: true}).click();
  await dialog.getByRole("button", {name: "Mark completed", exact: true}).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", {name: "Mark completed", exact: true})).toHaveCount(0);
  await page.getByLabel("Add a note", {exact: true}).fill("Resolution handled; customer informed.");
  await page.getByRole("button", {name: "Add note", exact: true}).click();
  await expect(page.getByText("Resolution handled; customer informed.", {exact: true})).toBeVisible();
  await noHorizontalOverflow(page);
});

test("two-tab stale edit preserves the unsaved draft", async ({page, context, request}) => {
  const row = await create(request);
  const other = await context.newPage();
  await Promise.all([page.goto(`/requests/${row.id}`), other.goto(`/requests/${row.id}`)]);
  await page.getByRole("button", {name: "Edit details", exact: true}).click();
  await other.getByRole("button", {name: "Edit details", exact: true}).click();
  await page.getByRole("dialog").getByLabel("Customer name", {exact: true}).fill("First agent saved");
  await other.getByRole("dialog").getByLabel("Customer name", {exact: true}).fill("Second agent unsaved draft");
  await page.getByRole("dialog").getByRole("button", {name: "Save details", exact: true}).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await other.getByRole("dialog").getByRole("button", {name: "Save details", exact: true}).click();
  await expect(other.getByRole("dialog").getByRole("alert")).toContainText("changed");
  await expect(other.getByRole("dialog").getByLabel("Customer name", {exact: true})).toHaveValue("Second agent unsaved draft");
  const saved = await request.get(`/api/requests/${row.id}`);
  expect((await saved.json()).data.customerName).toBe("First agent saved");
  await noHorizontalOverflow(other);
  await other.close();
});

test("external removal clears cached details and actions after a refusal", async ({page, request}) => {
  const row = await create(request);
  await page.goto(`/requests/${row.id}`);
  await expect(page.getByRole("heading", {name: row.reference, exact: true})).toBeVisible();
  const removed = await request.delete(`/api/requests/${row.id}`, {data: {expectedVersion: row.version}});
  expect(removed.status()).toBe(204);
  await page.getByLabel("Add a note", {exact: true}).fill("Unsaved after external removal");
  await page.getByRole("button", {name: "Add note", exact: true}).click();
  await expect(page.getByRole("alert")).toContainText(/not found|removed/);
  await expect(page.getByRole("heading", {name: row.reference, exact: true})).toHaveCount(0);
  await expect(page.getByRole("button", {name: "Edit details", exact: true})).toHaveCount(0);
  await expect(page.getByRole("button", {name: "Start review", exact: true})).toHaveCount(0);
});

test("a note committed before a500 response is not blindly retried", async ({page, request}) => {
  const row = await create(request);
  let submitted = 0;
  await page.route(`**/api/requests/${row.id}/notes`, async route => {
    submitted++;
    const response = await route.fetch();
    expect(response.status()).toBe(201);
    await route.fulfill({status: 500, contentType: "application/json", body: JSON.stringify({error: {code: "INTERNAL_ERROR", message: "The response was interrupted after processing.", fieldErrors: {}}})});
  });
  await page.goto(`/requests/${row.id}`);
  const note = `Response-loss note ${randomUUID()}`;
  await page.getByLabel("Add a note", {exact: true}).fill(note);
  await page.getByRole("button", {name: "Add note", exact: true}).click();
  await expect(page.getByText("A response was interrupted.", {exact: true})).toBeVisible();
  await expect(page.getByLabel("Add a note", {exact: true})).toHaveValue(note);
  await expect(page.locator("article").filter({hasText: note})).toBeVisible();
  await expect(page.getByRole("button", {name: "Add note", exact: true})).toBeDisabled();
  expect(submitted).toBe(1);
  const saved = (await (await request.get(`/api/requests/${row.id}`)).json()).data;
  expect(saved.notes.filter((n: {body: string}) => n.body === note)).toHaveLength(1);
});
