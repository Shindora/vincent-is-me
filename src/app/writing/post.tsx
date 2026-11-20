import type { Metadata } from "next";
import { posts } from "@/content";
import { Band, Tags } from "../ui";

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
      <Band>
        <div className="page-head">
          <p className="post-meta mono">
            <Tags tags={post.tags} />
            <span>
              {post.date} · {post.readingTime} read
            </span>
          </p>
          <h1 className="page-title">{post.title}</h1>
          <p className="page-dek">{post.summary}</p>
        </div>
      </Band>
      <div className="wrap post-grid">
        <nav className="toc" aria-label="On this page">
          <span className="toc-label mono">Contents</span>
          {sections.map(([id, label], i) => (
            <a key={id} href={`#${id}`}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <article className="prose">{children}</article>
      </div>
    </>
  );
}
