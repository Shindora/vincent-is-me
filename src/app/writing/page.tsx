import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content";

export const metadata: Metadata = { title: "Writing" };

export default function Writing() {
  return (
    <>
      <div className="grid page-head">
        <span />
        <h1 className="title">Writing</h1>
      </div>
      <section className="grid row">
        <h2 className="label">All posts</h2>
        <div>
          {posts.map((p) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="post-link">
              <span className="date mono">{p.date}</span>
              <span>
                <span className="post-title">{p.title}</span>
                <p className="post-summary">{p.summary}</p>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
