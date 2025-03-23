import type { Report, Ticket, Paste } from "@shared/schema";

// Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1353411162825297951/blTPjUr9QKafwd0ABzaTbGMD5pQiyM5jy9LjCCo7TTdhjcCraYtbZeFefKYNdOHA1IMZ";

interface WebhookPayload {
  content?: string;
  embeds?: Array<{
    title: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
  }>;
}

/**
 * Send message to Discord webhook
 */
export async function sendToDiscord(payload: WebhookPayload): Promise<void> {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to send webhook:", await response.text());
    }
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}

/**
 * Send abuse report to Discord
 */
export async function sendAbuseReport(report: Report, paste: Paste): Promise<void> {
  return sendToDiscord({
    embeds: [
      {
        title: "⚠️ Abuse Report",
        color: 16711680, // Red
        fields: [
          {
            name: "Paste ID",
            value: `${paste.id} (${paste.shortUrl})`,
            inline: true,
          },
          {
            name: "Title",
            value: paste.title || "Untitled",
            inline: true,
          },
          {
            name: "Syntax",
            value: paste.syntax,
            inline: true,
          },
          {
            name: "Reason",
            value: report.reason,
          },
          {
            name: "Content Preview",
            value: paste.content.length > 500 
              ? paste.content.substring(0, 500) + "..." 
              : paste.content,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

/**
 * Send support ticket to Discord
 */
export async function sendSupportTicket(ticket: Ticket): Promise<void> {
  return sendToDiscord({
    embeds: [
      {
        title: "🎫 Support Ticket",
        color: 3447003, // Blue
        fields: [
          {
            name: "Subject",
            value: ticket.subject,
          },
          {
            name: "Email",
            value: ticket.email || "Anonymous",
            inline: true,
          },
          {
            name: "Message",
            value: ticket.message,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });
}
