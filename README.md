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

### v1.4.0 — Transparent logo asset swap
- Replaced the loader OFF-state logo with the supplied transparent `offsignlogotp.png` artwork while preserving the existing `offsignlogo.png` path used by the site.
- Replaced the loader ON-state and homepage logo artwork with the supplied transparent `nowalltexturelogotp.png` while preserving the existing `nowalltexturelogo.png` path.
- No loader timing, transitions, scroll effects, live systems, toast behavior, navigation, or page structure were changed.


## v1.4.1
- Replaced the transition text/neon mock sign with the supplied transparent OFF/ON B&B logo images.
- Transition timing and brick-door close/open behavior remain unchanged: OFF image appears first, then the ON image ignites before navigation.
- Brightened the loader OFF image so the artwork stays clearly visible while still looking unpowered.


### v1.4.3
- Loader OFF sign now gives one quick teaser flash during loading, then stays off.
- At 100%, the OFF/ON supplied logos rapidly flicker several times before settling fully ON.
- Existing page transitions and site systems remain unchanged.


## v1.4.3 loader fix
The loader flicker now swaps the actual supplied OFF and ON transparent logo images with a teaser flash during loading and a repeated sputter sequence at 100%, then locks ON before the page fade.


## v1.4.4 navigation logo update
- Replaced the old navigation image with the transparent OFF/ON B&B neon logo pair.
- Navigation logo stays ON normally, performs a short electrical OFF/ON blink, then returns ON.
- Blink repeats once every 60 seconds; no rapid continuous flashing.
- Existing loader, transition, Live page, toast, theatre mode, scroll effects, and other systems were left intact.


## v1.4.5
- Fixed the Home navigation logo so it uses the transparent OFF/ON image stack and visibly blinks on a gentle 60-second interval.
- Reduced loader flashing to a few spaced power-on flashes, then holds fully ON for 2 seconds at 100% before entering the page.
- Reworked the Home hero logo float to use independent translate motion for seamless animation and added a subtle occasional OFF/ON blink.


## v1.4.7
- Added Joseph Romero developer/technical credit to the site footer.
- Crew cards now open neon profile popouts with blurred background and accessible close control.
- Updated all four crew roles to Host / Co-Host, with Joseph Romero listed last and technical production responsibilities summarized.


## v1.4.8 brand update
- Public name: B & B Backyard Podcast.
- Loader uses the sunset without logo first, then the supplied sunset/logo image at completion before fading into the page.
- Navigation, home hero, and footer use the supplied transparent bottle-cap logo.
- Existing transitions, live systems, crew profiles, social links, toast system, smoke, scroll effects, and mobile behavior are preserved.


## v1.4.9
- Added supplied crew portraits to the existing Crew cards and profile modal.
- Page transition now uses the blank bottle cap first, then the supplied logo bottle cap.
- Added a weathered roadside-billboard frame around the existing sunset loader without changing its loading behavior.

Version 1.4.42: Crew modal portraits now render behind the transparent WANTED poster opening and scale to fill the portrait window.

- v1.4.47: Crew order and responsibilities updated: Bill Brading (Founder / Brand Originator), Ora Johnson (Co-Founder / Musician), Lamont Terry (PR & Equipment Operations), Joseph Romero (Technical Production).

## v1.4.53
- Mobile initial loader now fully masks the underlying page until loading is complete.
- Mobile page transition doors use a straight edge-to-edge close/open to prevent 3D skew and center gaps.
- Desktop transition behavior and all other site systems remain unchanged.

## v1.4.55 — Automatic YouTube + Twitch social sync
The site now includes a GitHub Actions workflow that refreshes `data/social-feed.json` every 10 minutes and can be run manually from Actions.

Required GitHub repository secrets (Settings → Secrets and variables → Actions):
- `YOUTUBE_API_KEY` — Google Cloud API key with YouTube Data API v3 enabled.
- `TWITCH_CLIENT_ID` — Twitch Developer application Client ID.
- `TWITCH_CLIENT_SECRET` — Twitch Developer application Client Secret.

The workflow resolves YouTube handle `@BnBEntertains`, reads its uploads playlist, checks recent video live status, and checks Twitch channel `bandbpodcast`. API secrets are used only inside GitHub Actions and are never shipped to the public website.


## v1.4.56 — Restream unified chat
The Live page now uses one unified Restream chat panel instead of separate YouTube/Facebook and Twitch chat boxes. To connect it, copy the Restream Chat **Embed in stream** URL and paste it into `restreamChatEmbedUrl` in `js/live-config.js`. The embed displays incoming comments from supported connected destinations. Viewers use the included platform buttons to open the source platform when they want to send a message with their own account.


## v1.4.57 — Restream any-live-stream chat connected
The Live page is now configured to load the Restream **Embed chat from any live stream** feed inside the existing unified western chat panel. The separate platform buttons remain available for viewers who want to open the source platform directly.

## v1.4.58 — Country live status + western notifications
- Replaced the legacy neon OFF AIR/LIVE sign styling with a wood-and-brass country status board.
- Live status remains driven by `data/social-feed.json`, generated by the existing GitHub Actions YouTube/Twitch sync.
- The page now shows a neutral checking state until the first feed response instead of briefly claiming OFF AIR before the sync returns.
- Reworked notification toasts as western B&B Backyard Bulletin cards while preserving close controls, links, timer, social-feed notifications, and mobile behavior.


## v1.4.59 — Custom western live-status frame
The Live page status module now uses the supplied transparent western frame artwork. Status text stays centered inside the artwork, uses the site display font stack, and switches automatically between checking, off-air, and live states without neon effects. Preview Notification and Test Live Status controls remain below the module.


## v1.4.61 — live sign ON/OFF artwork switching
The Live status module now uses the lantern-off artwork while checking/offline and automatically swaps to the original lantern-lit artwork when YouTube/Twitch live detection reports a live broadcast. Existing status text, preview/test controls, Restream chat, and social sync are preserved.

## v1.4.62 — Dark OFF live sign + automatic Clips page
- OFF/checking live sign is deliberately darkened; LIVE/test-live removes the dark treatment and shows the lit artwork at full brightness.
- Clips page now builds itself from `data/social-feed.json` instead of placeholder cards.
- Existing YouTube uploads automatically appear on Clips, and the Twitch sync now also retrieves recent broadcaster clips.
- Future TikTok/Facebook feed items will render automatically on Clips when those platform integrations are connected.


## v1.4.63 — Automatic full livestream episodes
The Episodes page now reads completed YouTube livestream archives from `data/social-feed.json`. The GitHub social-sync workflow identifies a finished livestream by YouTube `liveStreamingDetails.actualEndTime`, then the full YouTube replay appears automatically on Episodes after the next sync.


## v1.4.64 — Falling bottle-cap transition + mobile doors
The page transition bottle cap now drops from above with a partial spin and small physical landing bounce instead of flashing. Mobile transition doors were tightened to cover the full dynamic viewport and overlap cleanly at the center before reopening.

## v1.4.65 — real bottle-cap video transition
- Replaced the CSS-generated/flashing transition bottle cap with the supplied WebM bottle-cap fall animation.
- The barn doors close first, the bottle-cap video plays once, then navigation continues and the destination doors reopen.
- Preserved the repaired mobile door coverage and all v1.4.64 live/social/clip/episode systems.

## v1.4.66 — bottle-cap WebM transition visibility fix
- Replaced the transition media with the exact user-supplied `transparent.webm` file.
- Added an explicit WebM `<source type="video/webm">` and more reliable preload/load/canplay playback handling.
- Raised the bottle-cap video above the closed barn doors and made the visible playback state explicit on desktop and mobile.
- Removed the prior reduced-motion rule that could suppress the supplied transition video.

## v1.4.68 — Updated bottle-cap transition video
- Replaced the transition WebM with the newer user-provided bottle-cap animation while preserving the v1.4.66 visibility/playback fixes.


## v1.4.69
- Added TikTok official Creator Profile Embed for @bnb_entertains on Socials. It displays recent public TikTok videos automatically without changing the existing cowboy social cards or other site systems.


## v1.4.71 — same supplied bottle-cap WebM on mobile
- Replaced the transition WebM with the newly supplied transparent WebM.
- Mobile now uses the exact same WebM transition as desktop; removed the v1.4.70 animated WebP mobile fallback.
- Preserved the v1.4.70 mobile loader centering fix and all other site systems.

## v1.4.72 — supplied transparent WebM on desktop + mobile
- Replaced `assets/video/bottlecap-transition.webm` with the newly supplied `latestmpasdf.webm` unchanged.
- Desktop and mobile both reference this exact same WebM asset.
- Updated the transition asset cache key to v1.4.72 so browsers request the replacement file instead of the previous cached transition.
- No layout, loader, doors, TikTok, social sync, Live, Clips, Episodes, or other website systems were changed.


## v1.4.73
- Mobile page transitions now use a rotating B&B bottle-cap logo instead of WebM alpha video.
- The logo completes its spin and settles before navigation; destination doors then open normally.
- Desktop keeps the existing transparent WebM transition unchanged.


## v1.4.74
- Added the supplied Western Restream emblem to the Unified Live Chat header.
- Added a matching Restream card to Socials explaining its role in B&B's streaming/unified-chat setup.
- Preserved existing transition, loader, social sync, TikTok, Live, Episodes and Clips systems.


## v1.4.75
Removed the left hanging porch sign; mobile navigation uses a rotating 3-D coin-style B&B PNG with a subtle gold halo/glint, then settles before navigation; mobile barn doors now hinge in 3-D. Desktop transparent WebM and existing loader are unchanged.

- v1.4.76: Removed Lamont Terry portrait from the crew card and website assets at his request; preserved his name, role, and existing layout.


## v1.4.77 — Cozy home rebrand
Replaced the old billboard loading artwork with a CSS-rendered, centered welcome card while preserving loading progress/timing. Replaced all three WANTED poster treatments (crew cards, wide desktop modal, mobile modal) with warm wooden family-photo frames. Kept crew photos and click-to-open profile behavior; Lamont remains text-only with no photo. Other page systems, social integrations, and desktop/mobile transitions are unchanged.


## v1.4.78 — Living room visual update
Uses supplied cozy living-room photograph in the home hero, inner-page headers and welcome loader. Warmer wallpaper-inspired palette, family-photo framing, walnut navigation and footer. Preserves all HTML structures, existing scripts, transitions, integrations, and Lamont portrait removal.


v1.4.79: Crew heading warm muted color; centered loading progress/card; replaced page transitions with living-room fabric curtains and antique welcome frame on desktop and mobile. Existing navigation, page data, feeds and crew privacy unchanged.


v1.4.80: Cozy theme contrast polish across light backgrounds; contact email set to bnbentertains@gmail.com. No page structure or transition changes.
