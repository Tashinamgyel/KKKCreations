# KCreations

React and TypeScript website for KCreations. Fitting requests are sent directly from the browser
to the studio's Telegram chat.

The site uses client-supplied photography from `client photos/`. `npm run optimize:images` creates
responsive AVIF and WebP files in `public/assets/client/`; edit source photographs only in the client
folder so the production derivatives remain reproducible.

## Local Development

```sh
npm install
npm run dev
```

Create `.env.local` with the Telegram bot token and destination chat ID before testing bookings:

```sh
VITE_TELEGRAM_BOT_TOKEN=your-bot-token
VITE_TELEGRAM_CHAT_ID=your-studio-chat-id
```

Vite embeds both values in the public browser bundle. This is an intentional frontend-only setup,
so the bot must be dedicated to receiving KCreations appointment requests.

## Telegram Setup

1. Add the bot to the private chat or group where the client will receive bookings, and
   send the bot a message so that Telegram exposes the chat in `getUpdates`.
2. Put the bot token and destination chat ID in `.env.local` using the variable names above.

Customer details are not stored by this project; they are validated in the browser and sent directly
to Telegram. Because Telegram responses are opaque to cross-origin browser requests, the interface
can report that the request was sent but cannot independently verify that Telegram accepted it.

## Careers Content

Approved job postings live in `src/data/careers.ts`. Add an entry to `careerOpenings` to publish a
role on the Careers page, or leave the list empty to show the “No Open Positions” state.

## Quality Checks & Deployment

```sh
npm run check
npm run deploy:dry
npm run deploy
```

`npm run build` also emits route-specific metadata, canonical URLs, social previews, JSON-LD, the
sitemap, and the Content Security Policy hash used by the static asset headers.
