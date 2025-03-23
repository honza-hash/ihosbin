import { useQuery } from "@tanstack/react-query";

// Type definition for the API statistics response
interface APIInfo {
  name: string;
  version: string;
  status: string;
  baseUrl: string;
  statistics: {
    totalPastes: string;
    totalComments: string;
    totalReports: string;
    totalTickets: string;
    topLanguages: Array<{ language: string; count: string }>;
    pastesLast24Hours: string;
    pastesByExpirationTime: Array<{ expiration: string; count: string }>;
  };
  endpoints: Array<{ path: string; description: string }>;
}

export default function Api() {
  // Fetch API info and statistics
  const { data: apiInfo, isLoading, error } = useQuery<APIInfo>({
    queryKey: ['/api/info'],
  });

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      
      {/* API Stats Display */}
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">API Statistics</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-slate-300">Loading statistics...</div>
          ) : error ? (
            <div className="text-red-400">Failed to load API statistics.</div>
          ) : apiInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Platform Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Total Pastes</div>
                      <div className="text-2xl font-bold">{apiInfo.statistics.totalPastes}</div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Total Comments</div>
                      <div className="text-2xl font-bold">{apiInfo.statistics.totalComments}</div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Last 24 Hours</div>
                      <div className="text-2xl font-bold">{apiInfo.statistics.pastesLast24Hours}</div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">API Status</div>
                      <div className="text-2xl font-bold flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${apiInfo.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {apiInfo.status}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Most Used Languages</h3>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    {apiInfo.statistics.topLanguages.length > 0 ? (
                      <div className="space-y-2">
                        {apiInfo.statistics.topLanguages.map((lang) => (
                          <div key={lang.language} className="flex justify-between items-center">
                            <span className="text-slate-300">{lang.language}</span>
                            <span className="text-slate-400 font-mono">{lang.count} pastes</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400">No data available</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">API Information</h3>
                  <div className="bg-slate-700 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-300">{apiInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Version:</span>
                      <span className="text-slate-300">{apiInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base URL:</span>
                      <span className="text-slate-300">{apiInfo.baseUrl}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expiration Distribution</h3>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    {apiInfo.statistics.pastesByExpirationTime.length > 0 ? (
                      <div className="space-y-2">
                        {apiInfo.statistics.pastesByExpirationTime.map((exp) => (
                          <div key={exp.expiration} className="flex justify-between items-center">
                            <span className="text-slate-300">{exp.expiration}</span>
                            <span className="text-slate-400 font-mono">{exp.count} pastes</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400">No data available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Introduction</h2>
        </div>
        <div className="p-6">
          <p className="mb-4 text-slate-300">
            ihosbin.fun provides a simple RESTful API that allows you to programmatically create and retrieve pastes.
            No API key or authentication is required.
          </p>
          <p className="mb-4 text-slate-300">
            All API endpoints return JSON responses and accept JSON requests. 
            Errors will include a meaningful message to help you debug issues.
          </p>
          <p className="text-slate-300">
            Base URL: <code className="bg-slate-700 px-2 py-1 rounded">https://ihosbin.fun/api</code>
          </p>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Create a new paste</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="bg-green-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">POST</span>
            <code className="font-mono">/paste</code>
          </div>
          
          <h3 className="text-lg font-semibold mb-3">Request Body</h3>
          <pre className="bg-slate-900 p-4 rounded mb-4 overflow-x-auto">
            <code>{`{
  "title": "Optional title",  // Optional
  "content": "Your paste content here",  // Required
  "syntax": "javascript",  // Optional, default: "plaintext"
  "expiration": "1d",  // Optional, default: "never"
  "isPrivate": false  // Optional, default: false
}`}</code>
          </pre>
          
          <h4 className="font-semibold mb-2">Available syntax options:</h4>
          <p className="mb-4 text-slate-300">
            plaintext, javascript, typescript, python, java, csharp, html, css, php, ruby, go, rust, c, cpp, shell, sql, json, yaml, markdown, xml
          </p>
          
          <h4 className="font-semibold mb-2">Available expiration options:</h4>
          <p className="mb-4 text-slate-300">
            never, 10m, 1h, 1d, 1w, 1m, 1y
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Response</h3>
          <pre className="bg-slate-900 p-4 rounded overflow-x-auto">
            <code>{`{
  "id": 123,
  "title": "Optional title",
  "content": "Your paste content here",
  "syntax": "javascript",
  "expiration": "1d",
  "createdAt": "2023-06-15T12:34:56.789Z",
  "expiresAt": "2023-06-16T12:34:56.789Z",
  "views": 0,
  "likes": 0,
  "commentsCount": 0,
  "isPrivate": false,
  "shortUrl": "abc12345"
}`}</code>
          </pre>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Example</h3>
          <pre className="bg-slate-900 p-4 rounded overflow-x-auto">
            <code>{`curl -X POST https://ihosbin.fun/api/paste \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "console.log(\\"Hello World!\\");",
    "syntax": "javascript",
    "title": "Hello World",
    "expiration": "1d"
  }'`}</code>
          </pre>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Get a paste</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
            <code className="font-mono">/paste/{'{id}'}</code>
          </div>
          
          <p className="mb-4 text-slate-300">
            Retrieves a paste by its ID or short URL. This will increment the view counter.
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Response</h3>
          <pre className="bg-slate-900 p-4 rounded overflow-x-auto">
            <code>{`{
  "id": 123,
  "title": "Optional title",
  "content": "Your paste content here",
  "syntax": "javascript",
  "expiration": "1d",
  "createdAt": "2023-06-15T12:34:56.789Z",
  "expiresAt": "2023-06-16T12:34:56.789Z",
  "views": 1,
  "likes": 0,
  "commentsCount": 0,
  "isPrivate": false,
  "shortUrl": "abc12345"
}`}</code>
          </pre>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Example</h3>
          <pre className="bg-slate-900 p-4 rounded overflow-x-auto">
            <code>{`curl https://ihosbin.fun/api/paste/abc12345`}</code>
          </pre>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Raw and Download</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
              <code className="font-mono">/paste/{'{id}'}/raw</code>
            </div>
            <p className="text-slate-300">
              Returns the raw content of the paste with appropriate content type headers.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
              <code className="font-mono">/paste/{'{id}'}/download</code>
            </div>
            <p className="text-slate-300">
              Returns the content of the paste as a downloadable file with appropriate filename.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Other Endpoints</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
              <code className="font-mono">/trending</code>
            </div>
            <p className="mb-4 text-slate-300">
              Get trending pastes. Optional query parameters:
            </p>
            <ul className="list-disc list-inside mb-4 text-slate-300">
              <li><code className="bg-slate-700 px-1 rounded">limit</code>: Number of pastes to return (default: 10)</li>
              <li><code className="bg-slate-700 px-1 rounded">period</code>: Time period - today, week, month, all (default: week)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
              <code className="font-mono">/latest</code>
            </div>
            <p className="mb-4 text-slate-300">
              Get most recent public pastes. Optional query parameters:
            </p>
            <ul className="list-disc list-inside mb-4 text-slate-300">
              <li><code className="bg-slate-700 px-1 rounded">limit</code>: Number of pastes to return (default: 10)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-post-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">POST</span>
              <code className="font-mono">/paste/{'{id}'}/like</code>
            </div>
            <p className="text-slate-300">
              Increments the like counter for a paste.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">GET</span>
              <code className="font-mono">/paste/{'{id}'}/comments</code>
            </div>
            <p className="text-slate-300">
              Get comments for a paste.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <span className="bg-green-600 text-white px-2 py-1 rounded mr-3 font-mono text-sm">POST</span>
              <code className="font-mono">/paste/{'{id}'}/comments</code>
            </div>
            <p className="text-slate-300">
              Add a comment to a paste. Request body should include <code className="bg-slate-700 px-1 rounded">content</code> field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
