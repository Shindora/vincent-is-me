import Link from "next/link";
import { principles, publications } from "@/content";
import { Band, PostTiles, ProjectCards, SectionHead, SystemPanel } from "./ui";

export default function Home() {
  return (
    <>
      <Band>
        <div className="hero">
          <div>
            <p className="kicker mono">Data &amp; AI engineer</p>
            <h1 className="headline">
              <span className="t-data">Data</span> and <span className="t-ai">AI</span>, built as one system.
            </h1>
            <p className="hero-sub">
              I build streaming systems, query engines and LLM infrastructure, and I judge them by the business outcome
              they move, not by the model inside.
            </p>
            <div className="cta">
              <a href="#work" className="btn btn-primary">
                See the work <span aria-hidden="true">→</span>
              </a>
              <Link href="/writing" className="btn btn-ghost">
                Read the writing
              </Link>
            </div>
          </div>
          <SystemPanel />
        </div>
      </Band>

      <div className="wrap">
        <section className="section">
          <SectionHead n="01" title="How I work" />
          <div className="principles">
            {principles.map((p) => (
              <div key={p.title} className="principle">
                <span className={`mark mark-${p.mark}`} aria-hidden="true" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-row">
            <div>
              <SectionHead n="02" title="Selected work" />
            </div>
            <Link href="/projects" className="section-link">
              All projects →
            </Link>
          </div>
          <ProjectCards limit={4} />
        </section>

        <section id="writing" className="section">
          <SectionHead n="03" title="Writing" />
          <PostTiles />
        </section>

        <section id="publications" className="section section-last">
          <SectionHead n="04" title="Publications" />
          <div className="pubs">
            {publications.map((p) => (
              <div key={p.title} className="pub">
                <span className="pub-year mono">{p.year}</span>
                <div>
                  {p.doi ? (
                    <a href={`https://doi.org/${p.doi}`} className="pub-title">
                      {p.title}
                    </a>
                  ) : (
                    <p className="pub-title">{p.title}</p>
                  )}
                  <p className="pub-venue">{p.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
