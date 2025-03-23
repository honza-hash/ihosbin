import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const routes = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/trending", label: "Trending", active: location === "/trending" },
    { href: "/api", label: "API", active: location === "/api" },
    { href: "/support", label: "Support", active: location === "/support" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-bold">
                ihosbin<span className="text-secondary-500">.fun</span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex space-x-8">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    route.active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/create">
                <Button className="hidden md:block">Create Paste</Button>
              </Link>
            </div>
            <div className="ml-2 -mr-2 flex items-center sm:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="mt-8 flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={`px-3 py-2 text-base font-medium rounded-md ${
                          route.active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {route.label}
                      </Link>
                    ))}
                    <Link
                      href="/create"
                      onClick={() => setOpen(false)}
                      className="mt-2"
                    >
                      <Button className="w-full">Create Paste</Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
