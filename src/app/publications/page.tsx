export default function Publications() {
  return (
    <div className="min-h-screen p-8 pt-20 terminal-background">
      <h1 className="text-4xl font-bold mb-8 glitch-text">RESEARCH_PAPERS::/</h1>
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="terminal-window p-4">
            <div className="flex items-start">
              <span className="text-cyber-green mr-2">[{index + 1}]</span>
              <div>
                <h2 className="text-xl text-cyber-pink mb-2">"{pub.title}"</h2>
                <p className="text-cyber-blue">{pub.venue}</p>
                <p className="text-cyber-green mt-2">DOI: {pub.doi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const publications = [
  {
    title: "Build a search engine for the knowledge of the course about Introduction to Programming based on ontology Rela-model",
    venue: "2020 12th International Conference on Knowledge and Systems Engineering (KSE), pp. 207-212",
    doi: "10.1109/KSE50997.2020.9287775"
  },
  {
    title: "Ontology-based Integration of Knowledge Base for Building an Intelligent Searching Chatbot",
    venue: "Sensors and Materials 33 (2021), p. 3101",
    doi: "10.18494/SAM.2021.3264"
  },
  {
    title: "An Empirical Study for Vietnamese Constituency Parsing with Pre-training",
    venue: "2021 RIVF International Conference on Computing and Communication Technologies (RIVF), pp. 1-6",
    doi: "10.1109/RIVF51545.2021.9642143"
  },
  {
    title: "Design Intelligent Educational Chatbot for Information Retrieval based on Integrated Knowledge Bases",
    venue: "IAENG International Journal of Computer Science 49.2 (2022), IJCS 49 2 28",
    doi: ""
  }
];