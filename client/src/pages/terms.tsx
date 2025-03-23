import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Terms() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
      
      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy" id="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="content" id="content">Content Policy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms" className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h3 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h3>
            <p>
              By accessing or using ihosbin.fun, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">2. Description of Service</h3>
            <p>
              ihosbin.fun provides an anonymous text and code sharing service that allows users to 
              create, share, and view text snippets with optional syntax highlighting.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">3. User Conduct</h3>
            <p>
              You agree not to use ihosbin.fun for any illegal or unauthorized purpose. You must not 
              violate any laws in your jurisdiction (including copyright laws) when using our service.
            </p>
            <p>
              You are responsible for all content that you share through our service.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">4. Prohibited Content</h3>
            <p>
              The following content is prohibited on ihosbin.fun:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Malware, viruses, or any harmful code</li>
              <li>Personal or private information of others</li>
              <li>Content that infringes on intellectual property rights</li>
              <li>Illegal content or content promoting illegal activities</li>
              <li>Spam, phishing attempts, or scams</li>
              <li>Hate speech, harassment, or discriminatory content</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">5. Content Moderation</h3>
            <p>
              We maintain an active blacklist system to prevent abusive content. Content that violates 
              our policies may be removed without notice, and users who repeatedly violate our policies 
              may be blocked from using our service.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">6. Limitation of Liability</h3>
            <p>
              ihosbin.fun is provided "as is" without any warranties. We shall not be liable for any 
              damages arising from the use of our service.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">7. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant 
              changes by posting a notice on our website.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">8. DMCA Compliance</h3>
            <p id="dmca">
              We respect intellectual property rights and expect our users to do the same. If you believe that 
              your copyrighted work has been copied in a way that constitutes copyright infringement, please 
              submit a report through our support page.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h3 className="text-xl font-semibold mt-6">1. Information We Collect</h3>
            <p>
              At ihosbin.fun, we're committed to minimal data collection. We do not collect personal information 
              or require registration to use our service.
            </p>
            <p>
              We store only the following information:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>The content you choose to share (text/code)</li>
              <li>Metadata related to your paste (creation time, expiration, syntax)</li>
              <li>Anonymous view and like counts</li>
              <li>Anonymous comments if submitted</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">2. No Tracking</h3>
            <p>
              We do not use cookies, trackers, or fingerprinting to track users across sites. 
              We do not collect or store IP addresses with paste content.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">3. Data Retention</h3>
            <p>
              Content is stored according to the expiration time selected when creating a paste. 
              Once expired, content is permanently deleted from our systems.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">4. No Third-Party Sharing</h3>
            <p>
              We do not sell, trade, or otherwise transfer your information to third parties. 
              We do not monetize user data in any way.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">5. Abuse Reports</h3>
            <p>
              When you submit an abuse report, the information you provide is used solely for 
              the purpose of investigating and addressing the reported issue.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">6. Security</h3>
            <p>
              We implement reasonable security measures to protect the limited data we store. 
              However, no method of transmission or storage is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">7. Changes to Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify users of 
              significant changes by posting a notice on our website.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Content Policy</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h3 className="text-xl font-semibold mt-6">1. Prohibited Content</h3>
            <p>
              The following content is prohibited on ihosbin.fun:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <strong>Malware & Harmful Code:</strong> Any code or content designed to harm, 
                exploit, or gain unauthorized access to systems, including viruses, trojans, 
                ransomware, spyware, and similar harmful software.
              </li>
              <li>
                <strong>Personal Information:</strong> Content containing personal or private 
                information of any individual without their express consent, including but not 
                limited to addresses, phone numbers, email addresses, financial information, 
                and government-issued identification.
              </li>
              <li>
                <strong>Intellectual Property Violations:</strong> Content that infringes on 
                copyrights, trademarks, patents, or other intellectual property rights.
              </li>
              <li>
                <strong>Illegal Content:</strong> Any content that is illegal under applicable 
                laws, or that promotes, encourages, or facilitates illegal activities.
              </li>
              <li>
                <strong>Hate Speech & Harassment:</strong> Content that promotes or encourages 
                violence, hatred, or discrimination against any individual or group based on 
                attributes such as race, religion, ethnicity, gender, sexual orientation, disability, 
                or national origin.
              </li>
              <li>
                <strong>Spam & Scams:</strong> Unsolicited promotional content, phishing attempts, 
                or fraudulent schemes designed to deceive users.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">2. Content Moderation</h3>
            <p>
              We maintain an automated blacklist system to prevent known harmful patterns and 
              keywords. Reported content is reviewed by our team, and content found to be in 
              violation of our policies will be removed without notice.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">3. Reporting Violations</h3>
            <p>
              If you encounter content that violates our Content Policy, please use the "Report" 
              button on the paste or visit our Support page to submit a detailed report.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">4. Consequences of Violations</h3>
            <p>
              Content that violates our policies will be removed. In some cases, we may be 
              legally obligated to report certain types of illegal content to the appropriate 
              authorities.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">5. Appeals</h3>
            <p>
              If you believe your content was removed in error, you may submit an appeal 
              through our Support page. Please include the paste ID and an explanation of 
              why you believe the content does not violate our policies.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
