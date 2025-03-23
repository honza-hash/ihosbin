import PasteEditor from "@/components/feature/PasteEditor";
import TrendingPastes from "@/components/feature/TrendingPastes";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="py-12 md:py-20 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Modern, <span className="text-primary">Anonymous</span> Paste Service
          </h1>
          <div className="bg-primary/20 text-primary text-sm font-medium py-1 px-3 rounded-full mb-4">
            BETA
          </div>
        </div>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Share your code securely without registration. Available at <a href="https://beta.ihosbin.fun" className="text-cyan-400 hover:underline">beta.ihosbin.fun</a>
        </p>
        <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto">
          Powered by <span className="text-primary">Ihos Cloud Global Network</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="#new-paste">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 h-auto">
              Create New Paste
            </Button>
          </Link>
          <Link href="/pastes">
            <Button variant="outline" className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-bold py-3 px-8 h-auto">
              Browse All Pastes
            </Button>
          </Link>
        </div>
      </section>

      {/* New Paste Section */}
      <PasteEditor />

      {/* Trending Pastes Section */}
      <TrendingPastes />

      {/* Features Section */}
      <section id="features" className="py-10 border-t border-slate-800">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Choose ihosbin.fun</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">100% Anonymous</h3>
            <p className="text-slate-300">No registration required. We don't track or collect any user data.</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-purple-600/20 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Syntax Highlighting</h3>
            <p className="text-slate-300">Support for over 20+ programming languages with beautiful syntax highlighting.</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-cyan-400/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Fast</h3>
            <p className="text-slate-300">Built with modern tech for speed and security. Active content moderation.</p>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-10 border-t border-slate-800">
        <h2 className="text-2xl font-bold mb-6">Open API Access</h2>
        
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-bold text-lg">Developer-Friendly API</h3>
            <p className="text-slate-300 text-sm">Create and retrieve pastes programmatically. No API key required.</p>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium mb-2">Create a new paste</h4>
            <pre className="language-bash p-4 bg-slate-900 rounded"><code>{`curl -X POST https://beta.ihosbin.fun/api/paste \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "console.log('Hello from Ihos Cloud!');",
    "syntax": "javascript",
    "title": "Ihos Cloud Example",
    "expiration": "1d"
  }'`}</code></pre>
            
            <h4 className="font-medium mt-6 mb-2">Access paste content</h4>
            <pre className="language-bash p-4 bg-slate-900 rounded"><code>{`curl https://beta.ihosbin.fun/api/paste/{shortUrl}`}</code></pre>
            
            <div className="mt-6 text-center">
              <Link href="/api">
                <Button variant="link" className="text-primary hover:text-primary/90 font-medium">
                  View Complete API Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
