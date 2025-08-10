import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundLogo from "@/components/BackgroundLogo";
import FloatingActionButton from "@/components/FloatingActionButton";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAM - Gestion Association Moderne",
  description: "Application de gestion pour votre association",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundLogo />
        <Header />
        <main className="p-4">{children}</main>
        <FloatingActionButton />
      </body>
    </html>
  );
}
