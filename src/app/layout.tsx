import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReturnDesk",
  description: "A guided returns workspace for small online stores.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
