import Link from "next/link";
import type { CSSProperties } from "react";
import { LANG_COLORS, posts, projects, type Tag } from "@/content";
import { Nav } from "./client";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

export function Band({ children }: { children: React.ReactNode }) {
  return (
    <section className="band">
      <div className="wrap">
        <header className="masthead">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
            </span>
            Vincent Tran
          </Link>
          <Nav />
        </header>
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <>
      <p className="section-n mono">{n}</p>
      <h2 className="section-title">{title}</h2>
    </>
  );
}

export function Tags({ tags }: { tags: Tag[] }) {
  return (
    <span className="tags">
      {tags.map((t) => (
        <span key={t} className={`pill pill-${t}`}>
          {t === "ai" ? "AI" : "Data"}
        </span>
      ))}
    </span>
  );
}

export const tone = (tags: Tag[]) => (tags.length > 1 ? "both" : tags[0]);

export function ProjectCards({ limit }: { limit?: number }) {
  return (
    <div className="cards">
      {projects.slice(0, limit).map((p) => (
        <article key={p.name} className="card">
          <div className={`stripe stripe-${tone(p.tags)}`} />
          <div className="card-body">
            <div className="card-top">
              {p.url ? (
                <a href={p.url} className="card-name mono">
                  {p.name}
                </a>
              ) : (
                <span className="card-name mono">{p.name}</span>
              )}
              <Tags tags={p.tags} />
            </div>
            <p className="card-text">{p.summary}</p>
            <p className="card-meta mono">
              <span className="lang-dot" style={{ background: LANG_COLORS[p.lang] }} />
              {p.lang} · {p.meta}
              {p.post && (
                <Link href={`/writing/${p.post}`} className="card-post">
                  Read the post →
                </Link>
              )}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PostTiles() {
  return (
    <div className="cards">
      {posts.map((p) => (
        <Link key={p.slug} href={`/writing/${p.slug}`} className={`tile tile-${tone(p.tags) === "ai" ? "ai" : "data"}`}>
          <span className="tile-top mono">
            <Tags tags={p.tags} />
            <span>
              {p.date} · {p.readingTime}
            </span>
          </span>
          <span className="tile-title">{p.title}</span>
          <span className="tile-blurb">{p.blurb}</span>
          <span className="tile-more">Read the post →</span>
        </Link>
      ))}
    </div>
  );
}

const LAYERS: { kind: "data" | "ai" | "both"; name: string; note: string; label: string }[] = [
  { kind: "data", name: "Move data", note: "Streams and pipelines the rest can trust", label: "streaming" },
  { kind: "data", name: "Govern and query", note: "One secured door to the warehouse and the lake", label: "SQL" },
  { kind: "both", name: "Turn data into meaning", note: "Models propose, the data decides", label: "LLM + checks" },
  { kind: "ai", name: "Serve models", note: "Inference that is fast, cheap and observable", label: "inference" },
  { kind: "ai", name: "Evaluate", note: "pass^k and cost per successful task", label: "evals" },
];

export function SystemPanel() {
  return (
    <figure className="system" aria-label="How the work fits together, from data to AI to business outcome">
      <div className="system-head mono">
        <span>data → AI → outcome</span>
        <span className="system-legend">
          <span>
            <i className="k-data" />
            data
          </span>
          <span>
            <i className="k-ai" />
            AI
          </span>
        </span>
      </div>
      <div className="rail">
        <ol className="layers">
          {LAYERS.map((l, i) => (
            <li key={l.name} className={`layer l-${l.kind}`} style={stagger(i)}>
              <i className="node" />
              <span>
                <span className="layer-name">{l.name}</span>
                <span className="layer-note">{l.note}</span>
              </span>
              <span className={`layer-proj mono p-${l.kind}`}>{l.label}</span>
            </li>
          ))}
          <li className="layer l-outcome" style={stagger(LAYERS.length)}>
            <i className="node" />
            <span>
              <span className="layer-name">Business outcome</span>
              <span className="layer-note">What every layer above is measured by</span>
            </span>
          </li>
        </ol>
        <span className="pulse" aria-hidden="true" />
      </div>
    </figure>
  );
}
