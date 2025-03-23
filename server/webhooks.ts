import type { Report, Ticket, Paste } from "@shared/schema";

// Discord webhook URL - nastavený na Discord kanál ihosbin.fun moderace
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1353411162825297951/blTPjUr9QKafwd0ABzaTbGMD5pQiyM5jy9LjCCo7TTdhjcCraYtbZeFefKYNdOHA1IMZ";

// Vždy povolíme webhooks, bez ohledu na produkční nebo vývojové prostředí
const ENABLE_WEBHOOK = true;

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
  const pasteUrl = `https://beta.ihosbin.fun/paste/${paste.shortUrl}`;
  const pasteRawUrl = `https://beta.ihosbin.fun/api/paste/${paste.shortUrl}/raw`;
  
  // Add buttons for moderation actions
  const components = [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 4, // Red color for Delete
          custom_id: `delete_paste:${paste.id}`,
          label: "Delete & Block"
        }
      ]
    }
  ];

  return sendToDiscord({
    components,
    embeds: [
      {
        title: "⚠️ Nahlášení závadného obsahu",
        description: `Byl nahlášen potenciálně závadný obsah na ihosbin.fun. Je potřeba prověřit a případně odstranit. [Zobrazit paste](${pasteUrl})`,
        color: 16711680, // Červená
        fields: [
          {
            name: "🆔 Paste ID",
            value: `${paste.id} (${paste.shortUrl})`,
            inline: true,
          },
          {
            name: "📋 Název",
            value: paste.title || "Bez názvu",
            inline: true,
          },
          {
            name: "🔠 Jazyk",
            value: paste.syntax,
            inline: true,
          },
          {
            name: "👀 Zobrazení",
            value: paste.views.toString(),
            inline: true,
          },
          {
            name: "❤️ Oblíbené",
            value: paste.likes.toString(),
            inline: true,
          },
          {
            name: "⏱️ Vytvořeno",
            value: new Date(paste.createdAt).toLocaleString(),
            inline: true,
          },
          {
            name: "⚠️ Důvod nahlášení",
            value: report.reason || "Neuvedeno",
          },
          {
            name: "🔍 Náhled obsahu",
            value: "```" + (paste.content.length > 400 
              ? paste.content.substring(0, 400) + "...\n[obsah zkrácen]" 
              : paste.content) + "```",
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "ihosbin.fun | Moderační systém"
        }
      },
    ],
    content: `⚠️ **NOVÉ NAHLÁŠENÍ:** Byl nahlášen závadný obsah - [Zobrazit](${pasteUrl}) | [Raw verze](${pasteRawUrl})`
  });
}

/**
 * Send support ticket to Discord
 */
export async function sendSupportTicket(ticket: Ticket): Promise<void> {
  const supportUrl = "https://beta.ihosbin.fun/support";
  
  return sendToDiscord({
    embeds: [
      {
        title: "🎫 Nový tiket podpory",
        description: `Uživatel odeslal nový požadavek na podporu, který vyžaduje reakci moderátora. [Přejít na stránku podpory](${supportUrl})`,
        color: 3447003, // Modrá
        fields: [
          {
            name: "📋 Předmět",
            value: ticket.subject || "Neposkytnut",
          },
          {
            name: "📧 Email",
            value: ticket.email || "Anonymní uživatel",
            inline: true,
          },
          {
            name: "⏱️ Vytvořeno",
            value: new Date(ticket.createdAt).toLocaleString(),
            inline: true,
          },
          {
            name: "📝 Zpráva",
            value: "```" + ticket.message + "```",
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "ihosbin.fun | Systém podpory"
        }
      },
    ],
    content: `📨 **NOVÝ TIKET PODPORY:** Prosím, zpracujte tento požadavek co nejdříve.`
  });
}
