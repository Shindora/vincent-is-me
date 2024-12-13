import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/ui/Navigation';
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vincent | Blog",
  description: "Personal blog of Vincent - Fullstack Overflow Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-cyber-black">
      <body className={`${jetbrainsMono.className} text-cyber-blue`}>
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}