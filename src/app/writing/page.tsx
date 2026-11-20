import type { Metadata } from "next";
import { Band, PostTiles } from "../ui";

export const metadata: Metadata = { title: "Writing" };

export default function Writing() {
  return (
    <>
      <Band>
        <div className="page-head">
          <p className="kicker mono">Writing</p>
          <h1 className="page-title">Notes on data, AI, and the systems between them.</h1>
        </div>
      </Band>
      <div className="wrap">
        <section className="section section-last">
          <PostTiles />
        </section>
      </div>
    </>
  );
}
