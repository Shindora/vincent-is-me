'use client';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Home() {
  return (
    <div className="min-h-screen p-8 terminal-background">
      <section className="mb-16 glitch-container">
        <div className="terminal-header">
          <span className="text-cyber-green">root@vincent</span>
          <span className="text-cyber-pink">:~$</span>
          <span className="typing-effect"> whoami</span>
        </div>
        
        <h1 className="glitch-text text-6xl font-bold mb-4" data-text="VINCENT">
          VINCENT
          <span className="text-cyber-green text-2xl block mt-2 terminal-text">
            [STATUS: ONLINE]
          </span>
        </h1>
        
        <div className="terminal-output space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-cyber-pink">❯</span>
            <span className="text-xl">Data Enthusiast</span>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="skill-column">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-cyber-green">⚡</span>
                <span className="text-cyber-pink">Engineering</span>
              </div>
              <ul className="space-y-2">
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-green mr-2">▸</span>
                  ETL/ELT Architecture
                </li>
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-green mr-2">▸</span>
                  Data Warehouse Design
                </li>
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-green mr-2">▸</span>
                  Distributed Systems
                </li>
              </ul>
            </div>

            <div className="skill-column">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-cyber-blue">🔬</span>
                <span className="text-cyber-blue">Science</span>
              </div>
              <ul className="space-y-2">
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-blue mr-2">▸</span>
                  Machine Learning
                </li>
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-blue mr-2">▸</span>
                  Statistical Analysis
                </li>
                <li className="terminal-line flex items-center">
                  <span className="text-cyber-blue mr-2">▸</span>
                  Generative AI & NLP
                </li>
              </ul>
            </div>
          </div>

          <div className="tech-stack mt-8">
            <span className="text-cyber-yellow">$ Tech Stack:</span>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="terminal-line flex items-center">
                <span className="text-cyber-blue mr-2">▸</span>
                Python • SQL • Spark
              </div>
              <div className="terminal-line flex items-center">
                <span className="text-cyber-blue mr-2">▸</span>
                AWS • GCP • Azure
              </div>
              <div className="terminal-line flex items-center">
                <span className="text-cyber-blue mr-2">▸</span>
                Docker • K8s
              </div>
              <div className="terminal-line flex items-center">
                <span className="text-cyber-blue mr-2">▸</span>
                Airflow • Dagster • dbt • Kafka & Redpanda
              </div>
            </div>
          </div>
        </div>
      </section>
      
      
      <section className="terminal-section">
        <h2 className="text-2xl font-bold mb-4 glitch-text">ESTABLISH_CONNECTION::/</h2>
        <div className="terminal-window">
          <div className="terminal-bar">
            <span className="terminal-circle red"></span>
            <span className="terminal-circle yellow"></span>
            <span className="terminal-circle green"></span>
          </div>
          <div className="terminal-content p-4">
            <div className="terminal-line flex items-center">
              <span className="text-cyber-green mr-2">▸</span>
              <FaGithub className="text-xl mr-2" />
              <span className="text-cyber-pink">github:</span>
              <a href="https://github.com/Shindora" target="_blank" rel="noopener noreferrer" 
                 className="ml-2 hover:text-cyber-blue transition-colors">
                github.com/Shindora
              </a>
            </div>
            <div className="terminal-line flex items-center">
              <span className="text-cyber-green mr-2">▸</span>
              <FaLinkedin className="text-xl mr-2" />
              <span className="text-cyber-pink">linkedin:</span>
              <a href="https://www.linkedin.com/in/tuan-vi-tran/" target="_blank" rel="noopener noreferrer"
                 className="ml-2 hover:text-cyber-blue transition-colors">
                linkedin.com/in/tuan-vi-tran
              </a>
            </div>
            <div className="terminal-line flex items-center">
              <span className="text-cyber-green mr-2">▸</span>
              <MdEmail className="text-xl mr-2" />
              <span className="text-cyber-pink">email:</span>
              <a href="mailto:vincent.tran.data@gmail.com" 
                 className="ml-2 hover:text-cyber-blue transition-colors">
                vincent.tran.data@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
