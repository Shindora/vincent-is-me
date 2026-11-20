import type { Metadata } from "next";
import { pagePaths } from "@/content";

export const metadata: Metadata = { title: "Visitors" };
export const revalidate = 3600;

const CODE = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;
const fmt = new Intl.NumberFormat("en-US");

async function visitors(path: string, start?: "week" | "month"): Promise<number | null> {
  const url = `https://${CODE}.goatcounter.com/counter/${encodeURIComponent(path)}.json${start ? `?start=${start}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.status === 404) return 0;
    if (!res.ok) return null;
    const { count } = (await res.json()) as { count: string };
    return Number(count.replace(/\D/g, ""));
  } catch {
    return null;
  }
}

export default async function Visitors() {
  const [total, month, week, ...perPage] = CODE
    ? await Promise.all([
        visitors("TOTAL"),
        visitors("TOTAL", "month"),
        visitors("TOTAL", "week"),
        ...pagePaths.map((p) => visitors(p)),
      ])
    : [null, null, null];
  const cells = [
    ["All time", total],
    ["Last 30 days", month],
    ["Last 7 days", week],
  ] as const;
  const pages = pagePaths.map((path, i) => ({ path, count: perPage[i] ?? 0 })).sort((a, b) => b.count - a.count);

  return (
    <>
      <div className="grid page-head">
        <span />
        <div>
          <h1 className="title">Visitors</h1>
          <p className="dek">
            Real counts from GoatCounter, a small open-source counter that uses no cookies and does not keep IP
            addresses. Known bots are left out.
          </p>
        </div>
      </div>

      {total === null ? (
        <section className="grid row">
          <span />
          <p className="note">The counter is not reachable right now, so there is nothing to show.</p>
        </section>
      ) : (
        <>
          <div className="grid" style={{ paddingBottom: 56 }}>
            <span />
            <div className="stats">
              {cells.map(([label, value]) => (
                <div key={label} className="stat">
                  <p className="stat-label">{label}</p>
                  <p className="stat-value mono num">{value === null ? "–" : fmt.format(value)}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="grid row">
            <h2 className="label">By page</h2>
            <div className="pages">
              {pages.map((p) => (
                <div key={p.path} className="page-row mono">
                  <span>{p.path}</span>
                  <span className="num">{fmt.format(p.count)}</span>
                </div>
              ))}
              <p className="note">GoatCounter caches these numbers for up to four hours.</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}
