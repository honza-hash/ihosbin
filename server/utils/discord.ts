import type { AbuseReport, SupportTicket, Paste } from "@shared/schema";

// Discord webhook URL from environment variable or fallback to the provided one
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1353411162825297951/blTPjUr9QKafwd0ABzaTbGMD5pQiyM5jy9LjCCo7TTdhjcCraYtbZeFefKYNdOHA1IMZ";

/**
 * Send an abuse report to Discord
 */
export async function sendAbuseReportToDiscord(report: AbuseReport, paste: Paste): Promise<void> {
  const content = `# New Abuse Report

**Paste ID:** ${paste.id}
**Paste Title:** ${paste.title || 'Untitled'}
**Reason:** ${report.reason}
**Reported At:** ${report.created_at.toISOString()}
**Reporter IP:** ${report.ip_address || 'Unknown'}

**Paste Content Preview:**
\`\`\`${paste.language}
${paste.content.substring(0, 800)}${paste.content.length > 800 ? '...' : ''}
\`\`\`

[View Paste](${getFullPasteUrl(paste.id)})
`;

  await sendToDiscord(content);
}

/**
 * Send a support ticket to Discord
 */
export async function sendSupportTicketToDiscord(ticket: SupportTicket): Promise<void> {
  const content = `# New Support Ticket

**Subject:** ${ticket.subject}
**Email:** ${ticket.email || 'Not provided'}
**Submitted At:** ${ticket.created_at.toISOString()}
**IP Address:** ${ticket.ip_address || 'Unknown'}

**Message:**
${ticket.message}
`;

  await sendToDiscord(content);
}

/**
 * Helper to send a message to Discord
 */
async function sendToDiscord(content: string): Promise<void> {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending to Discord:', error);
  }
}

/**
 * Get the full URL for a paste
 */
function getFullPasteUrl(pasteId: number): string {
  return `${process.env.PUBLIC_URL || 'https://ihosbin.fun'}/paste/${pasteId}`;
}
