import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">About ihosbin.fun</h1>
      
      <div className="space-y-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription className="text-slate-400">
              Privacy-focused code sharing for everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              ihosbin.fun was created as a modern, privacy-focused alternative to outdated pastebin services. 
              We believe that sharing code and text snippets should be easy, fast, and completely anonymous.
            </p>
            <p className="text-slate-300">
              Our platform is built with modern technologies to provide the best user experience 
              while maintaining a strong commitment to privacy and security.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Privacy Commitment</CardTitle>
            <CardDescription className="text-slate-400">
              Your data belongs to you, not us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Unlike many other services, we don't track your activity, collect your personal information, 
              or sell your data to third parties. We don't even require registration to use our service.
            </p>
            <p className="text-slate-300 mb-4">
              We only store the content you explicitly share, and you can set an expiration time 
              for automatic deletion. We believe in minimal data retention and maximum privacy.
            </p>
            <p className="text-slate-300">
              No cookies, no trackers, no fingerprinting — just a clean, simple service for sharing text and code.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription className="text-slate-400">
              What makes ihosbin.fun special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Syntax Highlighting</h3>
                <p className="text-slate-300">
                  Support for 20+ programming languages with beautiful, readable highlighting.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">100% Anonymous</h3>
                <p className="text-slate-300">
                  No registration or personal information required to create or view pastes.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Expiration Options</h3>
                <p className="text-slate-300">
                  Set your paste to automatically expire, from 10 minutes to 1 year.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Modern Interface</h3>
                <p className="text-slate-300">
                  Clean, responsive design that works on desktop, tablet, and mobile.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">API Access</h3>
                <p className="text-slate-300">
                  Simple RESTful API for creating and retrieving pastes programmatically.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Content Moderation</h3>
                <p className="text-slate-300">
                  Active moderation to prevent abuse and ensure a safe environment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Legal Use Only</CardTitle>
            <CardDescription className="text-slate-400">
              Our commitment to preventing abuse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              While we're committed to privacy, we also strictly prohibit illegal content, 
              malware, and other harmful material. We maintain a blacklist system to prevent 
              abusive content from being shared, and we respond promptly to abuse reports.
            </p>
            <p className="text-slate-300">
              See our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> for 
              more details on what's allowed on our platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
