import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/constants";

export default function Home() {
  const { data: trendingPastes, isLoading } = useQuery({
    queryKey: ['/api/pastes/trending/popular'],
    refetchOnWindowFocus: false
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Modern, Anonymous Code Sharing</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Share code snippets, collaborate, and discover trending pastes without giving up your privacy.
          </p>
          <div className="flex justify-center mt-8 space-x-4">
            <Link href="/create">
              <Button size="lg" className="rounded-lg">
                Create Paste
              </Button>
            </Link>
            <Link href="/trending">
              <Button size="lg" variant="outline" className="rounded-lg">
                Explore Trending
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <LockIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Anonymous Sharing</h3>
              <p className="text-muted-foreground">No account required. We don't collect or sell your data.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <CodeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Syntax Highlighting</h3>
              <p className="text-muted-foreground">Support for all major programming languages with beautiful syntax highlighting.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Content Moderation</h3>
              <p className="text-muted-foreground">Strict Terms of Service to prevent malicious content and ensure a safe environment.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Pastes Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Pastes</h2>
          <Link href="/trending">
            <Button variant="ghost" className="text-primary">
              View All <span className="ml-1">→</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading state
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="opacity-70 animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 w-1/3 bg-muted rounded mb-3"></div>
                  <div className="h-3 w-1/4 bg-muted rounded mb-6"></div>
                  <div className="h-24 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : trendingPastes && trendingPastes.length > 0 ? (
            // Display trending pastes
            trendingPastes.slice(0, 4).map((paste: any) => (
              <Link key={paste.id} href={`/paste/${paste.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-foreground">
                      {paste.title || 'Untitled Paste'}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <span className="mr-3"><CodeIcon className="inline h-3 w-3 mr-1" /> {paste.language}</span>
                      <span><time dateTime={paste.created_at}>{formatDate(paste.created_at)}</time></span>
                    </div>
                  </div>
                  <div className="p-4 overflow-hidden max-h-40 bg-muted/20">
                    <div className="text-sm font-mono truncate">
                      {paste.content.split('\n').slice(0, 5).join('\n')}
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center p-6 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No trending pastes available yet. Be the first to create one!</p>
              <Link href="/create">
                <Button className="mt-4">Create Paste</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Features & Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <CodeIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Language Support</h3>
            <p className="text-muted-foreground">Syntax highlighting for all major programming languages including JavaScript, Python, Java, C#, PHP, and many more.</p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Raw & Download Options</h3>
            <p className="text-muted-foreground">View code in raw format or download it directly to your device for offline reference and use.</p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground">Share your pastes through direct links, making collaboration and code sharing simple and efficient.</p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Comments & Discussion</h3>
            <p className="text-muted-foreground">Engage with others through the comment system to discuss code, suggest improvements, or ask questions.</p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Like & Trending System</h3>
            <p className="text-muted-foreground">Like pastes you find useful and discover trending content that's popular within the community.</p>
          </div>
          
          <div className="flex flex-col items-start">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">API Integration</h3>
            <p className="text-muted-foreground">Access our anonymous API to create and retrieve pastes programmatically for integration with your tools.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
