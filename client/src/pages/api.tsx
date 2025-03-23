export default function Api() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      
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
