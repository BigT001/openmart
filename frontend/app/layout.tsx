import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenMart - AI-Powered Shopping",
  description: "Discover amazing products with AI-powered search",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-950`}>
        {children}
      </body>
    </html>
  );
}
