'use client';
import { FaGithub } from 'react-icons/fa';

export default function Projects() {
  return (
    <div className="min-h-screen p-8 pt-20 terminal-background">
      <h1 className="text-4xl font-bold mb-8 glitch-text">PROJECT_ARCHIVE::/</h1>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="terminal-window p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-2xl text-cyber-pink">
                {project.title}
              </h2>
              <span className="text-cyber-green mx-2">|</span>
              <span className="text-cyber-blue">{project.tech}</span>
            </div>
            <div className="space-y-2 mb-4">
              {project.description.map((desc, i) => (
                <p key={i} className="terminal-line">
                  <span className="text-cyber-green mr-2">▸</span>
                  {desc}
                </p>
              ))}
            </div>
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyber-blue hover:text-cyber-pink transition-colors"
            >
              <FaGithub className="mr-2 text-xl" />
              <span className="mr-2">[SOURCE]</span> {project.github}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const projects = [
  {
    title: "ETL Template",
    tech: "Dagster, dbt, PostgreSQL, Docker, Apache Superset",
    description: [
      "Designed and implemented a comprehensive ETL template utilizing Dagster, dbt, and Apache Superset to create a robust data pipeline and analytics platform."
    ],
    github: "https://github.com/Shindora/data-stack-dagster-dbt-superset"
  },
  {
    title: "Data streaming with Redpanda and Quix template",
    tech: "Python, Redpanda, Quix",
    description: [
      "Developed a Python-based data streaming pipeline using Redpanda and Quix, enabling real-time data processing and analysis."
    ],
    github: "https://github.com/Shindora/redpanda-quix-processing-streaming-data"
  },
  {
    title: "Denoising Diffusion Models for Medical Images",
    tech: "PyTorch, Stable Diffusion, Computer Vision",
    description: [
      "Developed a generative model capable of synthesizing a large number of radiographical image/label pairs for medical imaging applications.",
      "Proposed and implemented a novel multi-branch model based on the Denoising Diffusion Probabilistic Model (DDPM), incorporating optimizations to enhance performance and efficiency."
    ],
    github: "https://github.com/Shindora/diffusors"
  }
];