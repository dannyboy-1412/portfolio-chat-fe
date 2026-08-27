# PRD: Portfolio Visual Redesign

## 1. Overview

Redesign the existing software engineering portfolio while preserving all existing content and functionality.

The primary goal is to replace the current terminal-heavy visual language with a simpler, cleaner, editorial-inspired design built around the existing dark green identity.

The redesign should reduce visual complexity without making the portfolio feel generic or removing its personality.

### Core design direction

> Dark green + editorial typography + whitespace + subtle interactions + strong project presentation

The portfolio should feel like a polished personal product rather than a terminal application.

---

## 2. Goals

### Primary goals

1. Create a significantly simpler visual design.
2. Preserve the existing dark green brand identity.
3. Keep all existing portfolio sections and information.
4. Reduce visual noise from cards, borders, pills and terminal-style UI.
5. Improve typography and visual hierarchy.
6. Make projects the strongest visual element of the portfolio.
7. Make the site feel professional enough for recruiters while retaining personality.
8. Keep the AI assistant but make it visually secondary.
9. Improve scanning and information discovery without requiring additional interaction.
10. Maintain a strong developer/engineering identity.

### Non-goals

This is **not a content rewrite**.

Do not:

- Remove projects.
- Remove experience.
- Remove education.
- Remove skills.
- Remove personal interests.
- Remove music/content sections.
- Remove the AI assistant.
- Remove project details.
- Replace the dark green theme with a generic black/white portfolio.
- Turn the site into a conventional resume website.

---

## 3. Design principles

### 3.1 Subtract before adding

The redesign should primarily achieve simplicity by removing visual complexity rather than introducing new UI components.

Avoid:

- Excessive cards
- Excessive borders
- Excessive badges
- Excessive icons
- Decorative gradients
- Large shadows
- Neon/glowing effects
- Excessive animations

### 3.2 Content stays, presentation changes

Existing information should remain available.

The redesign changes how information is presented, not what information is available.

### 3.3 Green is the identity, not the interface

The current dark green should remain the foundation.

However, green should not be applied to every UI element.

Recommended palette:

| Token | Value |
|---|---|
| Background | `#071A15` |
| Surface | `#0D241D` |
| Primary text | `#F1F0E8` |
| Secondary text | `#AEB9B2` |
| Accent | `#8FBF9F` |
| Warm cream | `#E8E4D8` |

Exact values can be adjusted during implementation.

---

## 4. Visual direction

### Quiet Editorial / Modern Engineering

The design should combine:

- Editorial typography
- Modern developer portfolio aesthetics
- Swiss-inspired grid systems
- Deep green backgrounds
- Large typography
- Generous whitespace
- Minimal borders
- Strong project imagery
- Subtle interaction

The website should feel calm rather than busy.

---

## 5. Typography

Typography is one of the biggest changes from the existing design.

### Primary font

Use a modern sans-serif such as:

- Geist
- Inter
- Manrope

### Optional display font

A restrained serif may be used for major headings:

- Instrument Serif
- DM Serif Display
- Cormorant

Only introduce a serif if it improves the visual identity.

### Monospace

Monospace should no longer be the primary typeface.

It can remain for:

- Technology names
- Code-related details
- Small metadata
- Technical labels

This preserves the engineering personality without making the entire website look like a terminal.

---

## 6. Navigation

Replace the heavily application-like navigation with a simple portfolio navigation.

Example:

```text
DANIEL A. RODRIGUES

Work
Experience
About
Contact
Resume ↗
```

### Behaviour

- Sticky navigation on desktop.
- Minimal navigation on mobile.
- No excessive navigation animations.
- Smooth scrolling between sections.
- Navigation should remain visually quiet.

---

## 7. Hero section

The hero should immediately communicate who the user is.

Example:

```text
Software Engineer

I build backend systems, AI products
and data platforms.

Backend · AI · Data · Cloud

[View my work]    [Resume]

5+ years experience
Australia
```

### Requirements

The hero should not require the AI assistant to understand the user's background.

The visitor should understand the user's professional identity within a few seconds.

---

## 8. Selected Work

This becomes the visual centrepiece of the portfolio.

Existing projects should remain.

Move away from conventional cards and use large editorial project sections.

Example:

```text
01

MESHA
AI accounting automation

80% reduction in reconciliation time
95% reconciliation match rate

TypeScript · Next.js · PostgreSQL · AWS
```

Followed by a large project visual.

### Project visual requirements

Each project should ideally have a visual representation.

Possible visuals:

- Product screenshots
- Architecture diagrams
- Dashboard screenshots
- Workflow diagrams
- UI screenshots
- Data visualizations
- Custom project illustrations

Do not use generic stock photography.

The visual should communicate what was actually built.

---

## 9. Project metrics

Existing metrics should become prominent visual elements.

Examples:

```text
80%
reduction in reconciliation time
```

```text
95%
reconciliation match rate
```

```text
97%
extraction accuracy
```

Metrics should be visually larger than surrounding descriptive text.

This gives recruiters a way to quickly understand impact without reading every paragraph.

---

## 10. Project details

Detailed project information should remain available.

Use one of:

- Expandable section
- Project detail page
- Inline expansion

Preferred approach: **inline expansion or dedicated project pages** rather than large modal interfaces.

Progressive disclosure:

```text
Project
↓
Summary
↓
Metrics
↓
Technical implementation
↓
Challenges
↓
Architecture
```

---

## 11. Experience

Replace large experience cards with an editorial timeline/list.

Example:

```text
EXPERIENCE

2025 — 2026

INFRRD
Software Development Engineer II

Document AI · Python · AWS
```

Then:

```text
2024 — 2025

MESHA
Software Engineer

AI Agents · TypeScript · AWS
```

Detailed responsibilities remain accessible.

### Visual requirements

- Minimal borders.
- Strong date hierarchy.
- Company name prominent.
- Role immediately visible.
- Technologies secondary.
- Hover state can reveal additional information.

---

## 12. Skills

Keep the existing skills.

Change presentation from individual UI components into grouped typography.

Example:

```text
TECHNOLOGIES

BACKEND
Python · Node.js · FastAPI · Express · Go

AI
LLMs · RAG · LangChain · AI Agents · Document AI

FRONTEND
React · Next.js · TypeScript

DATA
PostgreSQL · MongoDB · Redis · DuckDB · ClickHouse

INFRASTRUCTURE
AWS · Docker · RabbitMQ · Jenkins · Grafana
```

Avoid:

- Individual technology cards
- Large icon grids
- Excessive technology badges

---

## 13. Education

Keep all education information.

Present it as a simple editorial list.

Example:

```text
EDUCATION

2026 — 2028
Master of Applied AI
Deakin University

2017 — 2021
B.Tech Electrical & Electronics
VIT Vellore
```

The section should visually match Experience.

---

## 14. About

Keep the existing About information.

Make the opening statement more prominent.

Example:

```text
ABOUT

I like building systems where
good engineering and AI meet.
```

Then the existing supporting information.

The section can include:

- Professional background
- Engineering interests
- Technical focus
- Career history

Avoid turning the section into a long wall of text.

---

## 15. AI Assistant

The AI assistant remains a core feature.

However, it should no longer dominate the interface.

### New positioning

```text
CURIOUS ABOUT MY WORK?

Ask me about my projects,
experience or technical decisions.

[Ask about my work →]
```

Clicking opens the existing assistant.

### Important UX change

The visitor should **not need to use the AI assistant to discover basic portfolio information**.

The AI assistant is an enhancement for users who want deeper information.

---

## 16. Personal interests

Keep the existing personal content.

This section should provide personality without competing with professional content.

Example:

```text
OUTSIDE THE IDE

Football
Liverpool FC

Gaming
Valorant · CS:GO · FIFA

Music
Radiohead · Twenty One Pilots · Guitar

Films
The Prestige · Crime · Horror
```

Interactions can remain, but should be subtle.

---

## 17. Music section

Keep the existing music functionality/content.

Visually integrate it into the editorial design.

Avoid making it look like an independent application embedded into the portfolio.

It should feel like a small personal detail.

---

## 18. Contact

The final section should have a strong but simple CTA.

Example:

```text
LET'S BUILD SOMETHING.

Have a project, opportunity or
interesting problem?

Email
LinkedIn
GitHub
Resume
```

The CTA should be one of the strongest visual moments on the page.

---

## 19. Responsive design

The redesign must be designed mobile-first.

### Desktop

Use:

- Large typography
- Asymmetric layouts
- Multi-column project layouts
- Generous whitespace

### Tablet

Collapse multi-column sections where necessary.

### Mobile

Use:

- Single-column layout
- Reduced heading sizes
- Compact navigation
- Full-width project visuals
- Comfortable touch targets

Do not simply shrink the desktop layout.

---

## 20. Animation

Animation should communicate hierarchy rather than demonstrate technical capability.

Use:

- Subtle fade-in
- Gentle transform on project hover
- Smooth section transitions
- Navigation scroll behaviour
- Image reveal

Avoid:

- Excessive parallax
- Constant movement
- Glowing animations
- Terminal typing everywhere
- Long loading animations

The website should feel fast.

---

## 21. Cards and containers

### Current philosophy

```text
Everything is a card
```

### New philosophy

```text
Whitespace creates separation.
Typography creates hierarchy.
Lines create structure.
Cards are reserved for things that actually need containment.
```

Use cards only when there is a clear semantic reason.

---

## 22. Grid system

Use a consistent editorial grid.

Desktop:

```text
12-column grid
```

Typical structure:

```text
2 columns → metadata
8 columns → primary content
2 columns → supporting information
```

Project layouts can intentionally break the grid to create visual interest.

---

## 23. Design tokens

Create centralized design tokens for:

### Colours

```text
background
surface
surface-muted
text-primary
text-secondary
accent
border
```

### Typography

```text
display
h1
h2
h3
body
small
mono
```

### Spacing

Use a consistent spacing scale:

```text
4
8
12
16
24
32
48
64
96
128
```

---

## 24. Accessibility

Maintain:

- WCAG-compliant text contrast.
- Keyboard navigation.
- Visible focus states.
- Semantic HTML.
- Accessible interactive elements.
- Reduced-motion support.
- Proper heading hierarchy.
- Alt text for project visuals.

Do not sacrifice accessibility for the minimalist aesthetic.

---

## 25. Performance

The visual redesign should not make the website heavier.

Requirements:

- Optimize project images.
- Lazy-load images below the fold.
- Avoid unnecessary animation libraries.
- Maintain fast initial page load.
- Avoid large background videos.
- Avoid loading multiple unnecessary font families.

---

## 26. Success criteria

### Visual

The redesign is successful when:

- The site immediately feels simpler.
- Dark green remains recognizable as the brand.
- Typography becomes the dominant visual element.
- The site no longer feels like a terminal application.
- Projects visually stand out.
- There is substantially less UI clutter.

### UX

A visitor should be able to answer these questions without interacting with the AI:

1. Who is Danny?
2. What does he specialize in?
3. Where has he worked?
4. What has he built?
5. What technologies does he use?
6. How can I contact him?

### Brand

The site should communicate:

**Engineer + AI + systems + personality**

without looking like a generic developer portfolio.

---

## 27. Implementation strategy

Do **not** immediately rewrite the entire application.

Implement the redesign in stages.

### Phase 1: Design foundation

- New colour tokens
- New typography
- New spacing system
- New grid
- New buttons
- New navigation
- Remove excessive borders/cards

### Phase 2: Homepage

- Redesign hero
- Redesign project section
- Redesign project metrics
- Redesign AI assistant CTA

### Phase 3: Content sections

- Experience
- Skills
- Education
- About
- Personal interests
- Music

### Phase 4: Polish

- Responsive layouts
- Animation
- Hover states
- Accessibility
- Performance
- Mobile QA

### Phase 5: Validation

Compare the new design against the current portfolio at:

- Desktop 1440px
- Desktop 1920px
- Tablet
- Mobile 390px
- Mobile 430px

---

## 28. Final design rule

> **Do not add UI simply because the information needs somewhere to go.**

Use hierarchy, whitespace, typography and composition first.

The portfolio already has enough content.

The redesign's job is to make that content **look intentional, calm and easy to understand**.

### Target aesthetic

**Current personality + editorial design + modern typography + dark green + significantly less visual noise.**
