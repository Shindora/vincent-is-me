import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { GOATCOUNTER_CODE, pagePaths } from "@/content";
import { Band } from "../ui";

export const metadata: Metadata = { title: "Visitors" };
export const revalidate = 300;

const fmt = new Intl.NumberFormat("en-US");

async function visitors(path: string, start?: "week" | "month"): Promise<number | null> {
  const url = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${encodeURIComponent(path)}.json${start ? `?start=${start}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.status === 404) return 0;
    if (!res.ok) return null;
    const { count } = (await res.json()) as { count: string };
    return Number(count.replace(/\D/g, ""));
  } catch {
    return null;
  }
}

export default async function Visitors() {
  const [total, month, week, ...perPage] = GOATCOUNTER_CODE
    ? await Promise.all([
        visitors("TOTAL"),
        visitors("TOTAL", "month"),
        visitors("TOTAL", "week"),
        ...pagePaths.map((p) => visitors(p)),
      ])
    : [null, null, null];
  const cells = [
    ["All time", total, "ink"],
    ["Last 30 days", month, "data"],
    ["Last 7 days", week, "ai"],
  ] as const;
  const pages = pagePaths.map((path, i) => ({ path, count: perPage[i] ?? 0 })).sort((a, b) => b.count - a.count);
  const top = Math.max(1, ...pages.map((p) => p.count));

  return (
    <>
      <Band>
        <div className="page-head">
          <p className="kicker mono">Visitors</p>
          <h1 className="page-title">Who reads this, counted honestly.</h1>
          <p className="page-dek">
            Real counts from GoatCounter, a small open-source counter that uses no cookies and does not keep IP
            addresses. Known bots are left out.
          </p>
        </div>
      </Band>

      <div className="wrap">
        {total === null ? (
          <section className="section section-last">
            <p className="note">
              {GOATCOUNTER_CODE
                ? "The counter is not reachable right now, so there is nothing to show."
                : "Counting has not started yet. Real numbers will appear here once the counter is connected."}
            </p>
          </section>
        ) : (
          <>
            <section className="section">
              <div className="stats">
                {cells.map(([label, value, mark]) => (
                  <div key={label} className="stat">
                    <span className={`mark mark-${mark}`} aria-hidden="true" />
                    <p className="stat-label">{label}</p>
                    <p className="stat-value mono">{value === null ? "–" : fmt.format(value)}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="section section-last">
              <p className="section-n mono">By page</p>
              <div className="pages">
                {pages.map((p) => (
                  <div key={p.path} className="page-row mono" style={{ "--w": `${(p.count / top) * 100}%` } as CSSProperties}>
                    <span className="page-path">{p.path}</span>
                    <span className="page-count">{fmt.format(p.count)}</span>
                  </div>
                ))}
              </div>
              <p className="note">GoatCounter caches these numbers for up to four hours.</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
