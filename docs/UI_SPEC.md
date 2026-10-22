# Interface and state plan

Queue → request workspace → guided decision → persistent outcome feedback.
Desktop table from 768px; mobile cards at 375px. Same data/capabilities, no separate business logic.
Queue: reference/customer/order-item/reason/status/date, searchable by customer/order/reference (additional fields allowed), filters, sort, count and pagination. URL state survives Back/navigation. 350ms debounce; cancel/ignore older reads; reset page on query/filter/sort/pageSize changes.
New request: customer/contact, order/item/quantity, reason; inline validation and preserved inputs.
Detail: reference/status, customer/item, decision panel, chronological notes. Mobile decision panel follows summary.
Only legal actions are offered. Refund toggles amount; changing resolution clears it. Approval copy explains detail locking and that no money is transferred.
Open removal explicitly warns the item remains blocked; never recommend false rejection just to free it.

Verify loading, background refresh, empty, filtered-empty, failed read, invalid form, refused write, stale version and uncertain response.
Errors remain beside fields, inside action dialog or on page with retry. Toast alone is insufficient.
Preserve drafts on conflicts; reload before reconciling uncertain writes. Note text matches do not prove exactly-once submission.
Keyboard navigation, labels, focus return on dialog close, visible focus and text status labels are required design checks. No reviewer illegal-action drawer, analytics dashboard or invented AI recommendations.
