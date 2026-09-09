# B&B Backyard Podcast Website — v1.0.0

A GitHub Pages-ready static website built around the supplied B&B Backyard Podcast logo and its black / charcoal / red / weathered wood / cream / amber palette.

## Included pages
- Home (`index.html`)
- Episodes
- Live
- Clips
- Crew
- About B&B
- Socials
- Contact

## Included features
- Responsive animated navigation with red glow hover/active states
- Custom B&B logo loading screen with animated waveform + progress bar
- Session-aware loader (full loader only once per browser tab/session)
- Live status UI
- On-site toast notification system
- Social feed polling module prepared for YouTube, TikTok, Facebook and future Twitch
- Mobile menu
- Contact form that opens the visitor's email app
- GitHub Pages-safe relative paths (works in a repository subfolder)

## Publish to GitHub Pages
1. Extract this ZIP.
2. Create a new GitHub repository, for example `bb-backyard-podcast`.
3. Upload everything *inside* the extracted folder to the repository root. `index.html` must be at the root.
4. Commit and push.
5. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
6. Choose your main branch and `/ (root)`, then Save.

## Before launch
### Add official social links
Open `socials.html` and replace each placeholder `href="#"` with your official YouTube, TikTok and Facebook URLs. Add Twitch later.

### Add contact email
Open `js/contact.js` and replace `YOUR_EMAIL_HERE` with the B&B contact email.

### Add real episodes / clips / crew
The starter content is intentionally easy to identify in `episodes.html`, `clips.html` and `crew.html`.

## Real-time social / live notifications
GitHub Pages is static. It cannot securely hold private API secrets or receive YouTube/TikTok/Facebook/Twitch webhooks by itself.

The included `js/social-sync.js` is the browser side of the system. It polls a single JSON endpoint every 60 seconds. A production endpoint should normalize all platform activity to this shape:

```json
{
  "live": {
    "isLive": true,
    "title": "B&B is live now",
    "url": "https://..."
  },
  "items": [
    {
      "id": "unique-platform-id",
      "platform": "YouTube",
      "type": "video",
      "title": "New episode title",
      "message": "New B&B video is up.",
      "url": "https://...",
      "publishedAt": "2026-09-09T12:00:00Z"
    }
  ]
}
```

Then put that endpoint into this line in `js/social-sync.js`:

```js
const FEED_ENDPOINT = 'https://YOUR-ENDPOINT-HERE';
```

### Recommended backend
A Supabase project works well for this:
- `social_posts` table for normalized posts/videos/clips
- `livestreams` table for live state
- Supabase Edge Functions for platform API/webhook handling
- optional Realtime subscription later instead of polling

Platform integrations must follow each platform's current API/webhook permissions. TikTok and Facebook especially may require app review/permissions. Do not put secret API keys in this GitHub Pages repository.

## Browser push notifications
The current v1 displays instant toasts to visitors **while the website is open**. True push notifications while the site is closed require an opt-in push service/backend and VAPID credentials; this should be added server-side rather than exposing secrets in the repository.

## Logo
Original supplied logo is stored at:
`assets/images/bandbpodcastlogo.png`
