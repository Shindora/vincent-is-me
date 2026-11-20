import type { Metadata } from "next";
import { posts } from "@/content";

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)!;

export const postMetadata = (slug: string): Metadata => {
  const post = postBySlug(slug);
  return { title: post.title, description: post.summary };
};

export function Post({
  slug,
  sections,
  children,
}: {
  slug: string;
  sections: readonly (readonly [string, string])[];
  children: React.ReactNode;
}) {
  const post = postBySlug(slug);
  return (
    <>
      <div className="grid page-head" style={{ borderBottom: "1px solid var(--rule)" }}>
        <p className="head-meta mono">
          {post.date}
          <br />
          {post.readingTime}
        </p>
        <div>
          <h1 className="title">{post.title}</h1>
          <p className="dek">{post.summary}</p>
        </div>
      </div>
      <div className="grid" style={{ paddingTop: 48 }}>
        <nav className="toc" aria-label="On this page">
          <span className="label" style={{ marginBottom: 4 }}>
            Contents
          </span>
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <article className="prose">{children}</article>
      </div>
    </>
  );
}
