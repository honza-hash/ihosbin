import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to blacklist file
const blacklistPath = path.join(__dirname, '..', 'blacklist.txt');

// Regular expressions for malicious content
const MALWARE_PATTERNS = [
  // Common malware patterns
  /eval\s*\(\s*base64_decode/i,
  /document\.write\(\s*unescape\s*\(\s*['"][^'"]*['"]\s*\)\s*\)/i,
  /\\x[0-9a-f]{2}\\x[0-9a-f]{2}/i,
  /powershell\.exe\s+-\s*[Ee][Nn][Cc]/i,
  /<script[^>]*>.*?prompt\s*\(/i,
  /function\(\)\s*{\s*document\.location\s*=/i,
  /wget\s+http/i,
  /curl\s+http/i,
  /rm\s+-rf\s+\//i,
  /format\s+c:/i,
  /system\(\s*['"]rm/i,
  /\bexec\s*\(/i,
  /nc\s+-e\s+\/bin\/bash/i,
  /meterpreter/i,
  /netcat/i,
  /reverse shell/i,
  /\/dev\/tcp\//i,
  /\.decode\('base64'\)/i,
  /backdoor/i,
  /trojan/i,
  /keylogger/i,
  /get-process \| stop-process/i,
  /while\s*\(\s*true\s*\)\s*{\s*fork\s*\(/i,
  /crypto\.createCipher/i,
  /ransomware/i,
  /chmod\s+777/i
];

// Word blacklist from file
let wordBlacklist: string[] = [];

// Initialize blacklist from file
export function initBlacklist(): void {
  try {
    // Create default blacklist.txt if it doesn't exist
    if (!fs.existsSync(blacklistPath)) {
      const defaultBlacklist = [
        "malware",
        "exploit",
        "torrent",
        "warez",
        "cracked",
        "hack",
        "botnet",
        "phishing",
        "ddos",
        "rootkit",
        "keylogger",
        "trojan",
        "virus",
        "ransomware",
        "spyware"
      ].join('\n');
      
      fs.writeFileSync(blacklistPath, defaultBlacklist);
    }
    
    // Load blacklist from file
    const content = fs.readFileSync(blacklistPath, 'utf-8');
    wordBlacklist = content.split('\n')
      .map(word => word.trim())
      .filter(word => word && !word.startsWith('#'));
    
    console.log(`Loaded ${wordBlacklist.length} blacklisted terms`);
  } catch (error) {
    console.error('Failed to initialize blacklist:', error);
    // Fallback to minimal list if file can't be read
    wordBlacklist = ["malware", "exploit", "trojan"];
  }
}

/**
 * Check if content contains blacklisted terms or patterns
 */
export function checkBlacklist(content: string): { blocked: boolean, reason: string } {
  // Check content against word blacklist
  for (const word of wordBlacklist) {
    if (content.toLowerCase().includes(word.toLowerCase())) {
      return { 
        blocked: true, 
        reason: `Content contains blacklisted word: "${word}"` 
      };
    }
  }
  
  // Check content against malware patterns
  for (const pattern of MALWARE_PATTERNS) {
    if (pattern.test(content)) {
      return { 
        blocked: true, 
        reason: `Content matches malware pattern: ${pattern}` 
      };
    }
  }
  
  return { blocked: false, reason: '' };
}

// Helper function for dirname in ES modules
function dirname(path: string): string {
  return path.substring(0, path.lastIndexOf('/'));
}

// Initialize blacklist on module import
initBlacklist();
