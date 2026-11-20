"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    goatcounter?: { count: (opts: { path: string }) => void };
  }
}

const LINKS = [
  { href: "/projects", label: "Projects", active: (p: string) => p.startsWith("/projects") },
  { href: "/writing", label: "Writing", active: (p: string) => p.startsWith("/writing") },
  { href: "/#publications", label: "Publications", active: () => false },
  { href: "/visitors", label: "Visitors", active: (p: string) => p === "/visitors" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={l.active(pathname) ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

// count.js counts the first page load itself; client-side navigations have to be reported by hand.
export function Tracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.goatcounter?.count({ path: pathname });
  }, [pathname]);
  return null;
}
