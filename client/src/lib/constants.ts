// Available syntax highlighting languages
export const AVAILABLE_LANGUAGES = [
  { value: "plaintext", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "shell", label: "Shell/Bash" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" }
];

// Expiration time options
export const EXPIRATION_OPTIONS = [
  { value: "never", label: "Never Expire" },
  { value: "10m", label: "10 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "1y", label: "1 Year" }
];

// Trending period options
export const TRENDING_PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" }
];

// File extensions for different syntaxes
export const FILE_EXTENSIONS: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  csharp: "cs",
  html: "html",
  css: "css",
  php: "php",
  ruby: "rb",
  go: "go",
  rust: "rs",
  c: "c",
  cpp: "cpp",
  shell: "sh",
  sql: "sql",
  json: "json",
  yaml: "yml",
  markdown: "md",
  xml: "xml",
  plaintext: "txt"
};

// Content types for different syntaxes
export const CONTENT_TYPES: Record<string, string> = {
  javascript: "application/javascript",
  typescript: "application/typescript",
  json: "application/json",
  html: "text/html",
  css: "text/css",
  xml: "application/xml",
  markdown: "text/markdown",
  plaintext: "text/plain"
};
