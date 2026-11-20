import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { GOATCOUNTER_CODE } from "@/content";
import { Tracker } from "./client";
import "./globals.css";


const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Vincent Tran · Data and AI engineer", template: "%s · Vincent Tran" },
  description: "Data and AI, built as one system, and judged by the business outcome it moves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <main>{children}</main>
        <footer className="band">
          <div className="wrap footer">
            <div className="foot-grid">
              <div>
                <h2 className="foot-title">Let’s talk data and AI.</h2>
                <p className="foot-sub">Email is the fastest way to reach me.</p>
              </div>
              <div className="foot-links">
                <a href="mailto:vincent.tran.data@gmail.com">
                  vincent.tran.data@gmail.com <span className="t-ai" aria-hidden="true">→</span>
                </a>
                <a href="https://github.com/Shindora">
                  GitHub <span className="t-data" aria-hidden="true">↗</span>
                </a>
                <a href="https://www.linkedin.com/in/tuan-vi-tran/">
                  LinkedIn <span className="t-data" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="foot-bottom mono">
              <span>© {new Date().getFullYear()} Vincent Tran</span>
              <Link href="/visitors">Visitors</Link>
            </div>
          </div>
        </footer>
        {GOATCOUNTER_CODE && (
          <>
            <Script data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`} src="https://gc.zgo.at/count.js" />
            <Tracker />
          </>
        )}
      </body>
    </html>
  );
}
