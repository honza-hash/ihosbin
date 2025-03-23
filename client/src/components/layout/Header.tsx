import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MoonIcon, SunIcon, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "All Pastes", path: "/pastes" },
    { name: "Trending", path: "/trending" },
    { name: "API", path: "/api" },
    { name: "Support", path: "/support" },
    { name: "About", path: "/about" }
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <span className="text-primary text-2xl font-bold">ihosbin<span className="text-cyan-400">.fun</span></span>
          </Link>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">BETA</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${
                location === item.path
                  ? "text-white font-medium"
                  : "text-slate-300 hover:text-white"
              } transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          
          <Link href="/#new-paste" className="hidden md:inline-flex">
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
              New Paste
            </Button>
          </Link>
          
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors ${
                  location === item.path ? "text-white font-medium" : "text-slate-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/#new-paste" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors text-center"
            >
              New Paste
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
