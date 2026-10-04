# Storygrove visual refresh

Release prepared on 4 October 2026. The existing GitHub/Hostinger deployment workflow is unchanged; GitHub Actions records each production deployment and its status.

## Preview

Run `node scripts/preview.cjs` from the repository root, then open `http://127.0.0.1:4173/`. This static preview server supports video byte ranges and PDF/GIF MIME types. It binds to localhost only.

## Updated routes

- `/index.html`: compact homepage, layered transparent hero, product collage, storyboard, AR preview, two videos started by clicking play, and three product links.
- `/kici/index.html`: Kici introduction, character artwork, four concept GIFs, and an actual screenshot of the farming sim prototype.
- `/alamku-ruang-kelasku/index.html`: a concise teaser with the Alamku identity, Lendo Novo Foundation collaboration, one welcome screen and a seven-second Digital Companion preview. Kit details and app-menu screenshots are omitted from this page.
- `/jejak-tumbuh/index.html`: three existing activities, a free printable pack and plain-language guidance for adults.

The existing quiz, integer-line game, game builder, Danau and AR implementations are retained. Their implementation files were not modified. Every product page has a large return-to-studio link.

The header's bold Our products menu opens on mouse hover on desktop. A pointer bridge and short closing delay make the dropdown easy to reach. Native click, tap, keyboard and Escape behavior remain available.

## Media and loading

- The sum of unique image files referenced by the homepage's image elements decreased from 11,805,631 to 2,328,713 bytes (about 80%). This compares asset file sizes, not a measured page-speed score; video posters, responsive alternatives and videos are excluded from that comparison.
- Hero images total 639,042 bytes for the large set and 291,496 bytes for the small set. Responsive sources select the appropriate landscape resolution.
- The magenta alpha residue in supplied landscape exports is corrected in the assets. No SVG alpha filter is needed during animation.
- Full videos use `preload="none"` and receive their source only when the central play button is clicked. Starting one pauses the other.
- The seven-second AR preview is a muted, inline MP4 (785,662 bytes) for efficient looping on the homepage and click-to-play teasing on the Alamku page. Companion app trial and media download links have been removed from the marketing pages.
- The new full AR video preserves the original compressed video/audio streams; only the container was prepared for streaming. It is not re-encoded.
- Below-fold images load lazily. Parallax updates via animation frames while the hero is visible. Reduced-motion preferences disable parallax and automatic AR looping.

## Printables

`site/assets/downloads/jejak-tumbuh-worksheet.pdf` contains three A4 worksheets: observation, counting, and storytelling. All three pages were rendered and visually checked. The PDF is 5,952 bytes.

## Verification

- JavaScript syntax checks and `git diff --check` pass.
- Local links, fragment targets, image paths, video paths and PDF download paths resolve on all four updated pages.
- Video streaming returns HTTP 206 for byte ranges. PDF returns `application/pdf`.
- Both full videos start from their play buttons; switching videos pauses the previous one. Initial load has no full-video source.
- Main page reviewed at 1280 and 390 pixels; all four routes checked at 320 and 768 pixels. No horizontal document overflow or clipped heading text remained.
- Mobile menu, product dropdown, product navigation and return-to-studio navigation checked in the browser.

## Design references

The supplied examples informed the tactile collage, layered scene and confident headings. Their assets and code are not included:

- https://www.tekatekistudios.com/
- https://splatteredink.com/
- https://everswap.com/
- https://mindjoin.netlify.app/
- https://www.ray-ban.com/uk/l/discover-ray-ban-exe

Source artwork and unused earlier media exports remain available in the working tree. The updated pages reference the optimized derivatives; avoid indiscriminately removing older assets because other routes may still use them.

## Latest editorial and visual refinements

- Hero copy identifies the studio, its work and the invitation to help children discover their potential. Values explicitly include real-world exploration.
- Six capability cards include Art & Technology Classes; Play & Board separates artwork from copy. The phone in the books collage stays 120 × 266 CSS pixels across viewport sizes.
- In Action has explanatory captions. Partner headings match the other sections, with centered logos below. The centered collaboration invitation uses a short illustrated band.
- Danau artwork forms a subtle background across the pages, with increased opacity so the plants and lake remain visible. A central wash preserves text clarity; the approved hero composition is retained. The added landscape WebP is 91,118 bytes.
- Four Kici GIFs total 2,140,523 bytes and only animate while visible; they have pause controls and respect reduced-motion preferences. Source videos are unchanged.
- The farming screenshot was captured from the existing local Kici colony prototype in the Android build assets. It is presented as development work, not a released game.
- Jejak Tumbuh has an original temporary SVG wordmark: flowing, monochrome outlines form a leaf-shaped footprint beside “jejak,” with small detached leaf shapes above, following the user's sketch and balancing the “tumbuh” line below. Product pages include development status and a collaboration invitation.
- Digital Companion is part of Alamku at `/alamku-ruang-kelasku/index.html#digital-companion`. The earlier preview URL redirects there and has no separate content. The seven-second teaser loads after clicking play and exposes no download or app-launch link.
- The page canvas and matching hero/header washes are white. Section titles have a decorative, screen-reader-hidden echo; explanatory paragraphs sit below titles, while Our values retains its two-column composition.
- What we do, Our products, In action and partner logos have layered scroll movement and hover lift/tilt. Only visible cards update through animation frames; there is no idle animation loop or added dependency. Touch and reduced-motion settings disable decorative card motion, and a playing film stays steady.
- Latest checks: all four marketing routes fit a 320px viewport, with no clipped headings. Desktop hover, scroll motion, partner logo sizes, click-to-play teaser, video controls, local links and JavaScript syntax were checked.
