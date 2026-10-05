/**
 * The crawlers this site turns away, in one list that robots.txt and the proxy both read.
 *
 * This stops a crawler that says who it is, and nothing else. robots.txt is a request, and
 * the proxy only sees the User-Agent a client chooses to send, so a scraper that lies about
 * being a browser walks straight past both. Nothing served to the public can be made
 * uncopyable; what this buys is that the well-known AI crawlers and the off-the-shelf
 * scraping tools get nothing.
 *
 * Search engines and link previews are deliberately absent: Googlebot, Bingbot, DuckDuckBot,
 * LinkedInBot, Twitterbot, facebookexternalhit, Slackbot, WhatsApp, TelegramBot, Discordbot.
 * Blocking them would take the site out of search and break every shared link.
 */

/** Crawlers that collect pages to train or feed a model. Named in robots.txt as they name themselves. */
export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "YouBot",
  "AI2Bot",
  "DuckAssistBot",
  "MistralAI-User",
  "Timpibot",
  "PetalBot",
];

/** Scraping libraries and headless browsers, which never read robots.txt at all. */
const SCRAPING_TOOLS = [
  "python-requests",
  "scrapy",
  "curl/",
  "wget/",
  "Go-http-client",
  "aiohttp",
  "httpx",
  "node-fetch",
  "HeadlessChrome",
  "PhantomJS",
];

const BLOCKED = new RegExp(
  [...AI_CRAWLERS, ...SCRAPING_TOOLS].map((name) => name.replace(/[/.]/g, "\\$&")).join("|"),
  "i"
);

export function isBlockedCrawler(userAgent: string | null): boolean {
  // A request with no User-Agent at all is a script, not a browser.
  return !userAgent || BLOCKED.test(userAgent);
}
