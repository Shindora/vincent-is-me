import type { Metadata } from "next";
import { Band, ProjectCards } from "../ui";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <>
      <Band>
        <div className="page-head">
          <p className="kicker mono">Projects</p>
          <h1 className="page-title">What I build and contribute to, across data and AI.</h1>
        </div>
      </Band>
      <div className="wrap">
        <section className="section section-last">
          <ProjectCards />
        </section>
      </div>
    </>
  );
}
