import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  preview?: boolean;
}

export const CodeBlock = ({ code, language, preview }: CodeBlockProps) => {
  const ref = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    const highlight = async () => {
      const hljs = await import('highlight.js/lib/core');
      
      // Import specific language syntaxes based on the language
      switch (language) {
        case 'javascript':
          const js = await import('highlight.js/lib/languages/javascript');
          hljs.default.registerLanguage('javascript', js.default);
          break;
        case 'typescript':
          const ts = await import('highlight.js/lib/languages/typescript');
          hljs.default.registerLanguage('typescript', ts.default);
          break;
        case 'python':
          const py = await import('highlight.js/lib/languages/python');
          hljs.default.registerLanguage('python', py.default);
          break;
        case 'html':
          const html = await import('highlight.js/lib/languages/xml');
          hljs.default.registerLanguage('html', html.default);
          break;
        case 'css':
          const css = await import('highlight.js/lib/languages/css');
          hljs.default.registerLanguage('css', css.default);
          break;
        case 'json':
          const json = await import('highlight.js/lib/languages/json');
          hljs.default.registerLanguage('json', json.default);
          break;
        case 'bash':
        case 'shell':
          const bash = await import('highlight.js/lib/languages/bash');
          hljs.default.registerLanguage('bash', bash.default);
          break;
        case 'markdown':
          const md = await import('highlight.js/lib/languages/markdown');
          hljs.default.registerLanguage('markdown', md.default);
          break;
        case 'yaml':
          const yaml = await import('highlight.js/lib/languages/yaml');
          hljs.default.registerLanguage('yaml', yaml.default);
          break;
        case 'java':
          const java = await import('highlight.js/lib/languages/java');
          hljs.default.registerLanguage('java', java.default);
          break;
        case 'csharp':
          const csharp = await import('highlight.js/lib/languages/csharp');
          hljs.default.registerLanguage('csharp', csharp.default);
          break;
        case 'php':
          const php = await import('highlight.js/lib/languages/php');
          hljs.default.registerLanguage('php', php.default);
          break;
        case 'ruby':
          const ruby = await import('highlight.js/lib/languages/ruby');
          hljs.default.registerLanguage('ruby', ruby.default);
          break;
        case 'go':
          const go = await import('highlight.js/lib/languages/go');
          hljs.default.registerLanguage('go', go.default);
          break;
        case 'rust':
          const rust = await import('highlight.js/lib/languages/rust');
          hljs.default.registerLanguage('rust', rust.default);
          break;
        case 'sql':
          const sql = await import('highlight.js/lib/languages/sql');
          hljs.default.registerLanguage('sql', sql.default);
          break;
        case 'xml':
          const xml = await import('highlight.js/lib/languages/xml');
          hljs.default.registerLanguage('xml', xml.default);
          break;
        // Default or plaintext doesn't need special highlighting
      }
      
      // Import CSS for highlighting
      await import('highlight.js/styles/atom-one-dark.css');
      
      // Apply highlighting if ref is available
      if (ref.current) {
        hljs.default.highlightElement(ref.current);
      }
    };
    
    highlight();
  }, [code, language]);
  
  return (
    <pre
      ref={ref}
      className={cn(
        "hljs language-" + language,
        "p-4 overflow-x-auto font-mono text-sm bg-slate-900",
        {
          "max-h-[220px] overflow-y-hidden": preview,
          "max-h-[600px] overflow-y-auto": !preview,
        }
      )}
    >
      <code>{code}</code>
    </pre>
  );
};
