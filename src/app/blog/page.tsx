export default function Blog() {
  return (
    <div className="min-h-screen p-8 pt-20 terminal-background">
      <h1 className="text-4xl font-bold mb-8 glitch-text">KNOWLEDGE_BASE::/</h1>
      <div className="grid gap-6">
        {posts.map((post, index) => (
          <div key={index} className="terminal-window p-4">
            <h2 className="text-xl text-cyber-pink mb-2">{post.title}</h2>
            <p className="text-cyber-green mb-4">{post.excerpt}</p>
            <div className="text-sm text-cyber-blue">{post.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const posts = [
  {
    title: "Building Robust Data Pipelines",
    excerpt: "Best practices for creating maintainable data infrastructure",
    date: "2024-01-15"
  },
  // Add more posts
];
