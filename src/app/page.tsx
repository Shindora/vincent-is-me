import Link from "next/link";
import { posts, principles, projects, publications } from "@/content";

export default function Home() {
  return (
    <>
      <section className="intro">
        <p className="lede">
          Data and AI engineer. I treat data and AI as one system, and I judge it by the business outcome it moves, not by
          the model inside it.
        </p>
        <p className="stack mono">Rust · Python · TypeScript · Scala · Kafka · DuckDB · Kubernetes</p>
      </section>

      <section className="grid row">
        <h2 className="label">How I work</h2>
        <div className="principles">
          {principles.map(([lead, text]) => (
            <p key={lead}>
              <strong>{lead}</strong> {text}
            </p>
          ))}
        </div>
      </section>

      <section id="work" className="grid row">
        <h2 className="label">Selected work</h2>
        <div>
          {projects.map((p) => (
            <article key={p.name} className="item">
              {p.url ? (
                <a href={p.url} className="item-name">
                  {p.name}
                </a>
              ) : (
                <span className="item-name">{p.name}</span>
              )}
              <p className="item-text">{p.summary}</p>
              <p className="meta mono">
                {p.meta[0]}
                <br />
                {p.meta[1]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="writing" className="grid row">
        <h2 className="label">Writing</h2>
        <div>
          {posts.map((p) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="post-link">
              <span className="date mono">{p.date}</span>
              <span className="post-title">{p.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="publications" className="grid row">
        <h2 className="label">Publications</h2>
        <div>
          {publications.map((p) => (
            <div key={p.title} className="pub">
              <span className="year mono">{p.year}</span>
              <div>
                {p.doi ? <a href={`https://doi.org/${p.doi}`}>{p.title}</a> : <p>{p.title}</p>}
                <p className="venue">{p.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid row">
        <h2 className="label">Elsewhere</h2>
        <div className="links">
          <a href="https://github.com/Shindora">GitHub</a>
          <a href="https://www.linkedin.com/in/tuan-vi-tran/">LinkedIn</a>
          <a href="mailto:vincent.tran.data@gmail.com">vincent.tran.data@gmail.com</a>
        </div>
      </section>
    </>
  );
}
