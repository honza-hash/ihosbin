import type { Report, Ticket, Paste } from "@shared/schema";

// Discord webhook URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || ""; // Get webhook URL from env

// Flag to enable/disable actual webhook sending (for development/testing)
const ENABLE_WEBHOOK = process.env.NODE_ENV === 'production';

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
    footer?: {
      text: string;
      icon_url?: string;
    };
  }>;
}

/**
 * Send message to Discord webhook
 */
export async function sendToDiscord(payload: WebhookPayload): Promise<void> {
  // Log the payload regardless of whether we send it
  console.log("[WEBHOOK]", JSON.stringify(payload, null, 2));
  
  // Only send the actual webhook if enabled and URL is configured
  if (ENABLE_WEBHOOK && DISCORD_WEBHOOK_URL) {
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
      } else {
        console.log("✅ Webhook sent successfully");
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
    }
  } else {
    console.log("⚠️ Webhook sending is disabled or URL not configured");
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
