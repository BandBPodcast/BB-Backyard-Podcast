# B&B Backyard Podcast — v1.1.0 GitHub Pages Ready

Official website for **B&B Backyard Podcast — Local Artist Discovery Network**.

## Correct GitHub setup

GitHub username: `BandBPodCast`
Repository: `BB-Backyard-Podcast`
Expected Pages URL: `https://bandbpodcast.github.io/BB-Backyard-Podcast/`

### IMPORTANT — upload the files at the repository root
After extracting this ZIP, open the extracted folder and upload the CONTENTS directly to the repository. GitHub must show `index.html` at the top level, alongside `about.html`, `episodes.html`, `css/`, `js/`, and `assets/`.

Do **not** upload the ZIP itself, and do **not** leave the entire site one folder deep.

Correct:
```
BB-Backyard-Podcast/
  index.html
  about.html
  episodes.html
  live.html
  clips.html
  crew.html
  socials.html
  contact.html
  css/
  js/
  assets/
```

Incorrect:
```
BB-Backyard-Podcast/
  BB-Backyard-Podcast-v1.1.0-GitHub-Ready/
    index.html
```

## Turn on GitHub Pages
Repository > Settings > Pages > Build and deployment
- Source: Deploy from a branch
- Branch: main
- Folder: / (root)
- Save

Then wait a few minutes and reload the Pages URL.

## v1.1.0 changes
- Restored the actual B&B logo asset inside the site package.
- Added the uploaded red/cyan brick background to all pages.
- Added neon red/cyan typography and navigation hover glow inspired by the supplied neon reference.
- Added a neon brick loading screen.
- Added an animated neon B&B page transition for internal navigation.
- Kept the existing page structure and social/live notification foundation intact.

## v1.2.0 neon animation update
- Home page "Backyard." text now uses a slow, occasional neon-tube flicker.
- Internal page transitions show the B&B neon sign powered OFF first, then flicker ON before navigating.
- First-session loading screen now treats the B&B podcast logo as a custom neon wall sign: it begins unpowered, tracks 0–100%, then ignites at 100% before revealing the site.

## v1.3.0 visual update
- Fixed the brief loading-screen flash during internal page transitions.
- Added seamless sliding brick doors: close -> neon sign off -> ignition -> destination -> doors open.
- Added a lightweight, pointer-events-disabled smoke atmosphere layer across the site.
- Added one slow neon-flicker word to every main page heading.
- Expanded the Crew page to four responsive crew-member cards.
- Added extra mobile transition, smoke, heading, and crew layout tuning.


## v1.3.1
- Fixed mobile horizontal overflow / side-to-side scrolling across all pages.
- Added safer responsive sizing for grids, headings, cards, buttons, loader, transition doors/sign, smoke overlay, footer, and toasts.
- Preserved the existing neon brick theme and animations.


## v1.3.3 live chat setup
Edit `js/live-config.js` and set `youtubeVideoId` to the current YouTube livestream video ID and `twitchChannel` to the Twitch channel name. YouTube Live Chat embeds use the current site hostname automatically. Twitch embeds also use the current hostname as the required `parent` domain. YouTube does not support embedded Live Chat on mobile web, so mobile visitors should open the stream in YouTube to chat.

### v1.3.4
- Moved the neon notification toast to the top-right on tablet/desktop while retaining safe full-width mobile positioning.
- Updated toast entrance/exit motion to animate naturally from the right side.

## v1.3.5 Live-page update
- Replaced the plain live-status bar with a neon OFF AIR / CURRENTLY LIVE sign.
- Added a Test Live Sign button beside Preview Neon Toast.
- Added Theatre Mode / lights-out focus for desktop and mobile.
- Left chat can switch between YouTube and Facebook. Because Facebook does not expose a dependable embedded live-chat composer for third-party sites, the Facebook tab opens the official Facebook Live post/comments instead; on mobile it is preferred automatically when configured.
- Twitch chat remains on the right.
- Configure `youtubeVideoId`, `twitchChannel`, and `facebookLiveUrl` in `js/live-config.js`.


## v1.3.6 — Official social links

Official accounts now wired into the website:
- YouTube: https://www.youtube.com/@BnBEntertains
- TikTok: https://www.tiktok.com/@bnb_entertains
- Facebook: https://www.facebook.com/profile.php?id=61579615124683
- Twitch: https://www.twitch.tv/bandbpodcast

The Twitch channel is also preconfigured in `js/live-config.js`. The YouTube channel is saved there too, but the current static player still needs an individual live video ID until the automatic live-status backend is connected.


## v1.3.7 motion polish
Added viewport fade/reveal animations, a neon scroll-to-top button that shifts from cyan to red with scroll progress, a smoother loader-to-page fade, animated theatre-mode dimming, and a softer neon-toast entrance. Scroll restoration is disabled so every page opens at its top rather than restoring an old scroll position.


## v1.3.8
- Fixed the footer/floating scroll-to-top positioning issue caused by the first-load body filter animation.
- Scroll-to-top now stays viewport-fixed for the entire page; its outer frame starts unlit, powers to cyan, then reaches full red at the bottom.
- Fixed page-transition doors so the brick wall is continuous instead of appearing as two enlarged brick textures.
- Expanded scroll fade-in/fade-out animation to all main-page text across every page.
- Preserved the existing loader, smoke, neon status, toast, theatre mode, social links, and live-page systems.


## v1.3.9
- Added the supplied `offsignlogo.png` and `nowalltexturelogo.png` assets.
- Loader now displays the true OFF sign for the full loading cycle and swaps to the true neon ON sign only at 100%, preserving the existing loader timing/fade.
- Homepage logo imagery now uses `nowalltexturelogo.png`.
- Existing transitions, reveal animations, Live systems, theatre mode, toast, footer, and scroll-to-top behavior were left intact.
