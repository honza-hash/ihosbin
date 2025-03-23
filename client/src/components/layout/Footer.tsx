import { Link } from "wouter";
import { Github, Twitter, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ihosbin<span className="text-cyan-400">.fun</span></h3>
            <p className="text-slate-400 text-sm">A modern, anonymous alternative to Pastebin with focus on privacy and security.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#new-paste" className="text-slate-400 hover:text-white transition-colors">Create Paste</Link></li>
              <li><Link href="/trending" className="text-slate-400 hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="/api" className="text-slate-400 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/terms#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms#content" className="text-slate-400 hover:text-white transition-colors">Content Policy</Link></li>
              <li><Link href="/terms#dmca" className="text-slate-400 hover:text-white transition-colors">DMCA</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/support#report" className="text-slate-400 hover:text-white transition-colors">Report Abuse</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ihosbin.fun. We don't collect or sell your data.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
