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
