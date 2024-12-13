'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full bg-cyber-black/80 backdrop-blur-sm z-50 border-b border-cyber-green/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-cyber-green hover:text-cyber-blue transition-colors">
            <span className="font-mono">~/vincent</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              href="/projects" 
              className={`terminal-link ${pathname === '/projects' ? 'text-cyber-pink' : 'text-cyber-green'}`}
            >
              ./projects
            </Link>
            <Link 
              href="/blog" 
              className={`terminal-link ${pathname === '/blog' ? 'text-cyber-pink' : 'text-cyber-green'}`}
            >
              ./blog
            </Link>
            <Link 
              href="/publications" 
              className={`terminal-link ${pathname === '/publications' ? 'text-cyber-pink' : 'text-cyber-green'}`}
            >
              ./publications
            </Link>
            <Link 
              href="/analytics" 
              className={`terminal-link ${pathname === '/analytics' ? 'text-cyber-pink' : 'text-cyber-green'}`}
            >
              ./visitors
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
