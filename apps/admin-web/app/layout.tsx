import "./styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenBank NG Admin",
  description: "Operations and compliance console for OpenBank NG.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
