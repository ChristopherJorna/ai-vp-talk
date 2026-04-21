# AI in Virtual Production — Teaching Deck

A ~30 min informal Zoom talk for students. Sketchbook aesthetic, keyword-only slides.

**Live:** https://christopherjorna.github.io/ai-vp-talk/

## Run locally

Open `index.html` in a browser. No build step.

Or serve with any static server:
```bash
python -m http.server 8000
# open http://localhost:8000
```

## Controls

- `→` / `Space` — next slide
- `←` — previous
- `1`–`9` — jump to slide
- `Home` / `End` — first / last
- Click left/right edges of the screen
- Swipe left/right on touch

## Structure (14 slides)

1. Intro
2. Map — 4 places AI shows up in VP
3. Full Gen AI — impressive, not authentic
4. The VP Gap
5. Best of Both Worlds — White Wall
6. Inside the Pipeline — Riyadh building workflow
7. After the Pipeline — HighVis R&D (interactive wipe)
8. The Quiet Half — code AI
9. Claude Code in my workflow
10. Open Source Is Winning (+ Corridor Key)
11. Flow State
12. Before / After GIF (Find My Phone)
13. Optional clip (Find My Phone)
14. Close — "What future do you want to build?"

## Assets needed

Drop these into `assets/img/` manually if not already:

- `riyadh-workflow.jpeg` — the Nano Banana → Meshy → Unreal workflow screenshot (slide 6)

If missing, slide 6 shows a placeholder note.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial deck"
gh repo create ai-vp-talk --public --source=. --push
gh api -X POST /repos/ChristopherJorna/ai-vp-talk/pages -f source[branch]=main -f source[path]=/
```
