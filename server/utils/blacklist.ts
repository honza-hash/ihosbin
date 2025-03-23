import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from '../storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the blacklist file
const blacklistFilePath = path.join(__dirname, '..', '..', 'blacklist.txt');

/**
 * Load initial blacklist from a file if it exists
 */
export async function loadBlacklistFromFile(): Promise<void> {
  try {
    if (fs.existsSync(blacklistFilePath)) {
      const fileContent = fs.readFileSync(blacklistFilePath, 'utf-8');
      const patterns = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      
      for (const pattern of patterns) {
        try {
          // Try to compile the pattern as a regex to validate it
          new RegExp(pattern, 'i');
          
          // Add to the database if it's a valid pattern
          await storage.addBlacklistPattern({
            pattern,
            reason: 'Loaded from blacklist.txt',
          });
        } catch (e) {
          console.error(`Invalid regex pattern in blacklist.txt: ${pattern}`);
        }
      }
      console.log(`Loaded ${patterns.length} blacklist patterns from file`);
    }
  } catch (error) {
    console.error('Error loading blacklist from file:', error);
  }
}

/**
 * Check if content contains anything that matches the blacklist
 */
export async function checkBlacklist(content: string): Promise<boolean> {
  return storage.checkContentAgainstBlacklist(content);
}
