import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Nav, Tracker } from "./client";
import "./globals.css";

const GOATCOUNTER = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Vincent Tran", template: "%s · Vincent Tran" },
  description: "Data and AI engineer. Data and AI as one system, judged by the business outcome it moves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <div className="wrap">
          <header className="header">
            <Link href="/" className="brand">
              Vincent Tran
            </Link>
            <Nav />
          </header>
          <main>{children}</main>
          <footer className="footer mono">
            <span>© {new Date().getFullYear()} Vincent Tran</span>
            <Link href="/visitors">Visitors</Link>
          </footer>
        </div>
        {GOATCOUNTER && (
          <>
            <Script data-goatcounter={`https://${GOATCOUNTER}.goatcounter.com/count`} src="https://gc.zgo.at/count.js" />
            <Tracker />
          </>
        )}
      </body>
    </html>
  );
}
