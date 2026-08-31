import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restore Invoice Generator",
  description: "Create and download professional insurance invoices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
