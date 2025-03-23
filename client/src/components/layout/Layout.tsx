import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "wouter";
import { Plus } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
      
      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link href="/#new-paste">
          <div className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
        </Link>
      </div>
    </div>
  );
}
