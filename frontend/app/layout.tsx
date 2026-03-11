import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChangingRoom — Virtual Try-On",
  description: "Upload a photo of yourself and a clothing item to see how it looks on you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
