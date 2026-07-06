# AGENTS.md — SmartGym Frontend Operating Specification

> **Scope:** This file governs only the SmartGym frontend. It is the source of truth for frontend design, UX, interaction, assets, motion, routing, accessibility, quality, and delivery.  
> **Language:** All product copy, labels, errors, navigation, and UI must be in Spanish.  
> **Product:** SmartGym is a university sports-health platform with NFC access, sports-health records, medical-risk escalation, IoT telemetry, plans, review, adherence, XR, scheduling, reports, and governance.

---

## 0. Mandatory operating sequence

Before changing any code, execute this sequence exactly:

1. Read this entire file and `CLAUDE.md`.
2. Inspect the repository: `package.json`, lockfile, entrypoint, router, existing AppShell, theme setup, Bootstrap setup, current frontend folders, API clients/types, tests, scripts, assets, OpenAPI docs, README, and existing frontend documentation.
3. Use the environment's real `find-skills` workflow.
4. Search for these exact skills:
   - `impeccable design`
   - `wondel.ai skills`
   - `emil kowalski`
   - `taste skill`
   - `frontend-design`
   - `accessibility`
   - `react performance`
   - `gsap`
5. Use a skill only if it truly exists. Never claim an unavailable skill was used.
6. Create `docs/frontend-skill-report.md` with detected, used, and unavailable skills plus the fallback rules from this document.
7. Audit the current UI at desktop and mobile widths and save concrete findings in `docs/frontend-baseline-audit.md`.
8. Create `docs/frontend-implementation-plan.md` before coding: phases, routes, shared components, endpoint dependencies, asset plan, risks, and quality gates.
9. Work autonomously in small verified phases. Stop only for a real external blocker.
10. Run lint, typecheck, tests, and build after every meaningful phase.

Do not commit, push, merge, rebase, cherry-pick, delete branches, or alter GitHub/CI settings unless explicitly requested.

---

## 1. Scope and strict boundaries

### In scope

- React frontend architecture.
- React Router route tree and nested layouts.
- Bootstrap and React Bootstrap.
- Custom CSS/SCSS and CSS variables.
- GSAP motion and ScrollTrigger where justified.
- Responsive UI for confirmed SmartGym modules.
- Visual system, assets, icons, accessibility, loading, empty, error, and success states.
- API client adaptation only against confirmed backend contracts.
- Frontend tests, documentation, performance, and visual QA.

### Out of scope

- Backend, Java/Spring, JPA, Supabase, database, migrations, infrastructure, server security, API definition changes, or edge-device code.
- Changing endpoint contracts, backend DTOs, CORS, roles, server authorization, or persistence.
- AI implementation: no LLM, chatbot, OpenAI, embeddings, inference, model, recommendation engine, or AI dependency.
- Inventing production data, telemetry, users, medical records, alerts, audit events, roles, or endpoints.
- Copying layouts, images, source code, screenshots, or motion from Awwwards, Dribbble, Landon Norris, Emil Kowalski, or external sites.

### Clarification about the SmartGym AI module

The frontend may render plans, explanations, or review states returned by an **existing confirmed backend API**. It must never implement, simulate, or call an AI system itself.

---

## 2. Product context and module map

The frontend must behave as one product with a consistent shell and component system.

| Domain | Product purpose | Typical roles |
|---|---|---|
| Identity and NFC access | Register, block, replace, validate, and audit NFC wristbands/access attempts. | Administrator, trainer, doctor |
| Athlete sports-health record | View athlete profile, clearance, observations, sessions, alerts, and plans. | Doctor, trainer, athlete |
| Medical risk escalation | Surface risk alerts, severity, rationale, and resolution workflow. | Doctor, trainer |
| IoT telemetry and smart machines | Show machines, gateway state, latency, sync issues, and sessions. | Administrator, trainer |
| Training/nutrition plans | Render plans, objectives, versions, explanations, and activation state from existing APIs. | Trainer, nutritionist, athlete |
| Human plan review | Approve, reject, request changes, and trace reviewers. | Doctor, trainer, nutritionist |
| Monitoring and adherence | Show restrictions, follow-up, interventions, and adherence. | Doctor, nutritionist, trainer |
| Exergames/XR | Show compatibility, readiness, sessions, safety, and performance. | Athlete, trainer |
| Scheduling/capacity | Manage reservations, slots, occupancy, location, and capacity. | Administrator, trainer, athlete |
| Reports and analytics | Role-authorized reports, filters, exports, and traceability. | Administrator, doctor, trainer |
| Governance/security | Roles, consent, revocation, privacy, and audits. | Administrator |

Existing branches may contain separate feature work. Never alter another branch or assume a branch's API/data model. Build shared frontend primitives that integrate safely when confirmed contracts are available.

---

## 3. Required stack and dependency policy

### Required stack

- React.
- Existing React Router setup.
- Bootstrap.
- React Bootstrap.
- Custom project CSS or SCSS.
- GSAP for motion and ScrollTrigger where motion is justified.
- Existing icon system, or Bootstrap Icons only if already installed. If no icon package exists, use a small local SVG icon set with consistent stroke rules.

### Do not add

- Tailwind.
- Material UI.
- Chakra UI.
- shadcn/ui.
- Ant Design.
- Radix UI.
- Framer Motion.
- A second UI component library.
- Three.js, React Three Fiber, Lottie, or 3D libraries unless explicitly required later.
- A charting library unless one already exists.
- A global-state library unless already used and necessary.
- Any AI-related package.

### Dependency rule

Before installing a package:
1. Verify it is not already present.
2. Explain the frontend-only reason in `docs/frontend-dependency-log.md`.
3. Install only the minimum package required.
4. Do not replace the existing stack wholesale.

GSAP is permitted. Prefer only `gsap` and custom React hooks using `gsap.context()`; do not add another animation framework.

---

## 4. Brand direction: UCACUE-aligned SmartGym

### Source-of-truth rule

Do not say any HEX is an official Universidad Católica de Cuenca color unless an official manual, SVG, CSS token, or authorized asset is available in the repository or supplied by the user.

Until confirmed, use this **provisional UCACUE-aligned product palette** and label it as provisional in docs.

```css
:root {
  /* Provisional brand */
  --sg-crimson-900: #8F1727;
  --sg-crimson-800: #A81B2D;
  --sg-crimson-700: #C61F35;
  --sg-crimson-600: #D9384A;
  --sg-crimson-100: #FBE8EB;
  --sg-crimson-50: #FFF7F8;

  /* Institutional neutrals */
  --sg-ink-950: #131416;
  --sg-ink-900: #1B1C1F;
  --sg-ink-800: #292B2F;
  --sg-ink-700: #41444A;
  --sg-ink-600: #646770;
  --sg-silver-500: #9B9DA3;
  --sg-silver-300: #D0D2D6;
  --sg-silver-200: #E1E2E5;
  --sg-paper-50: #FBFAF8;
  --sg-paper-100: #F5F3F0;
  --sg-paper-200: #ECE8E4;

  /* Semantic tokens */
  --sg-success-800: #12664F;
  --sg-success-700: #197A60;
  --sg-success-100: #E6F5EF;
  --sg-warning-800: #8E4A05;
  --sg-warning-700: #AF610C;
  --sg-warning-100: #FFF3E4;
  --sg-danger-800: #971B1D;
  --sg-danger-700: #B42318;
  --sg-danger-100: #FDEBEC;
  --sg-info-800: #174C7B;
  --sg-info-700: #23669F;
  --sg-info-100: #EAF3FC;

  --sg-radius-sm: 8px;
  --sg-radius-md: 12px;
  --sg-radius-lg: 18px;
  --sg-shadow-sm: 0 1px 2px rgb(19 20 22 / 6%);
  --sg-shadow-md: 0 10px 28px rgb(19 20 22 / 10%);
}

:root,
[data-theme="light"] {
  --sg-canvas: #FBFAF8;
  --sg-surface: #FFFFFF;
  --sg-surface-raised: #F5F3F0;
  --sg-surface-inset: #F0EDEA;
  --sg-border: #E2DEDA;
  --sg-border-strong: #CFC8C2;
  --sg-text-primary: #1B1C1F;
  --sg-text-secondary: #5E6067;
  --sg-text-muted: #81838A;
  --sg-focus: #23669F;
}

[data-theme="dark"] {
  --sg-canvas: #151416;
  --sg-surface: #1D1B1E;
  --sg-surface-raised: #282427;
  --sg-surface-inset: #121113;
  --sg-border: #3D383C;
  --sg-border-strong: #564E53;
  --sg-text-primary: #F8F6F4;
  --sg-text-secondary: #D1CAC8;
  --sg-text-muted: #9A9092;
  --sg-focus: #8CBCE7;
  --sg-crimson-700: #D84A59;
  --sg-crimson-600: #E45B68;
  --sg-crimson-100: #3A1D22;
  --sg-success-700: #45B98A;
  --sg-success-100: #183D30;
  --sg-warning-700: #E1A448;
  --sg-warning-100: #4A3417;
  --sg-danger-700: #F1797E;
  --sg-danger-100: #4A1F23;
  --sg-info-700: #7FB3E4;
  --sg-info-100: #1D3852;
}
```

### Color rules

- Crimson: primary CTA, active navigation, selected high-priority state, and identity.
- Danger red: irreversible actions, blocking, revocation, destructive confirmations, and high-risk states only.
- Communicate status with icon + text + color; never color alone.
- Never use pure black canvas or a pure-white global canvas.
- No generic purple/blue SaaS gradients, neon, or high saturation across the UI.
- Light and dark themes are separate semantic systems, not automatic inversion.
- Validate WCAG 2.1 AA contrast for text, focus, controls, tags, charts, and status signals.

---

## 5. Identity, logos, and original assets

### Official UCACUE mark

Use the official UCACUE logo only if an authorized asset already exists or is supplied. Do not regenerate, trace, redraw, alter, or approximate it.

### SmartGym sub-brand

If no equivalent asset exists, create an original local SVG mark:

- geometric shield;
- one NFC/radio wave;
- subtle circular wristband/access point;
- crimson, charcoal, and silver;
- flat geometry;
- no text in the symbol;
- no gradient;
- no 3D;
- no mascot;
- no biometric likeness.

It must work at 16px, 24px, 32px, 48px, and 64px. Suggested files:

```text
src/assets/brand/smartgym-mark.svg
src/assets/brand/smartgym-lockup.svg
src/assets/brand/favicon.svg
```

Create `docs/brand-assets.md` explaining ownership, sizes, use, and restrictions.

---

## 6. External visual research protocol

Research references first if browsing is available.

### Permitted research sources

- Awwwards: layout rhythm, editorial composition, interaction hierarchy, photography treatment, and responsive transitions.
- Dribbble: micro-interactions, tables, command panels, controls, data density, and system UI patterns.
- `https://landonorris.com/`: scroll storytelling, image reveals, pacing, and spatial transitions.
- Official GSAP examples/docs: correct motion implementation.
- Existing authorized SmartGym/UCACUE assets.

### Required research deliverable

Create `docs/frontend-visual-research.md` with at least 6 references. Each entry must include:

- source URL;
- one-sentence description;
- 2–3 specific learnings;
- exact SmartGym adaptation;
- why it supports the product;
- explicit statement that no layout, code, asset, copy, or animation is copied.

### Never do this

- Do not download images from Awwwards/Dribbble.
- Do not embed or screenshot their assets.
- Do not reproduce a page pixel-for-pixel.
- Do not treat a reference as a partner.
- Do not use inaccessible animation simply because it looks impressive.

---

## 7. Image and asset plan

The operational app remains information-first. Do not place photos behind dense data tables, access logs, active medical alerts, forms, audit trails, or irreversible actions.

### Photography may be used only in

- authenticated welcome/product overview;
- onboarding;
- module explainer headers;
- contextual empty states where a photo has a real purpose;
- help/how-it-works content.

### Photography must not be used in

- active clinical alerts;
- medical records;
- audit logs;
- access logs;
- approval queues;
- confirmation dialogs;
- security-critical forms;
- destructive workflows.

### Required asset manifest

Before downloading/generating any asset, create `docs/frontend-assets-manifest.md` with:

- asset ID;
- screen and purpose;
- source/generation method;
- license/authorization;
- URL or generation prompt;
- original and target size;
- file name;
- responsive variants;
- Spanish alt text;
- decorative/informative classification;
- loading priority;
- final optimized format.

### Asset slots and prompts

| Asset ID | Where used | Search/generation brief |
|---|---|---|
| `hero-campus-training` | Product overview only | `modern university high performance training facility in Ecuador, wide architectural editorial photograph, warm daylight, warm charcoal details, subtle crimson equipment accent, no visible brand logos, no readable screens, no identifiable faces` |
| `nfc-access-closeup` | NFC onboarding/help only | `close-up of a hand wearing a neutral NFC wristband near a secure access reader on a modern gym machine, premium editorial photography, warm graphite setting, subtle crimson accent light, no visible brand logos, no readable UI` |
| `iot-machine-detail` | IoT module explainer only | `connected strength training machine with a compact edge sensor enclosure and tidy wiring, industrial product photography, warm charcoal and silver, subtle crimson accent, no text, no logos` |
| `clinical-team-review` | Clinical workflow explainer only | `sports medicine professional reviewing non-identifiable training data on a tablet in a university sports lab, editorial documentary photography, no readable screen text, no patient identifiers, no logos` |
| `xr-training-space` | XR module explainer only | `athlete from behind using a mixed reality headset in a modern university training studio, dynamic but restrained editorial photograph, no logos, no readable UI` |
| `empty-state-nfc` | Access empty state | Original monochrome SVG: shield, NFC wave, and access point; no mascot/robot/person |
| `empty-state-audit` | Audit empty state | Original monochrome SVG: ledger lines, shield, timeline node; no mascot/robot/person |
| `empty-state-iot` | IoT empty state | Original monochrome SVG: machine outline, node, status line; no mascot/robot/person |

### Asset requirements

- Prefer authorized real photos. If generated, document provenance.
- Do not use logos/trademarks/celebrity likenesses/UI screenshots.
- Convert photos to AVIF or WebP.
- Use `<picture>` or `srcSet` for responsive images where needed.
- Explicit `width`/`height` to prevent layout shift.
- `loading="lazy"` for noncritical images.
- Informative image has useful Spanish alt text; decorative image has `alt=""`.
- Do not use imagery to fill blank space.

---

## 8. Design principles

### Never create a generic dashboard

Do not create:

- default 4-KPI card grids;
- oversized empty cards;
- every section inside the same rounded card;
- generic “welcome back” screens;
- widgets without a decision/action;
- decorative gradients;
- giant titles;
- thin low-contrast text;
- unused whitespace;
- generic stock-photo backgrounds;
- robots/mascots;
- visual “AI” motifs.

### The interface should feel like

- university-grade sports-health operations software;
- a clear control room when risk/operations demand it;
- calm and readable in clinical contexts;
- high-performance but restrained in athlete contexts;
- one system, not unrelated Bootstrap pages.

### Mandatory UI principles

- Human and specific Spanish labels.
- One consistent typeface family.
- Consistent horizontal alignment.
- Icon + label for complex actions.
- Scannable headings, compact descriptions, useful icons.
- One icon family and consistent stroke/weight.
- Explicit choices: never ambiguous `OK`, `Aceptar`, or generic `Cancelar` labels.
- Steppers for meaningful multi-step workflows.
- Errors show what happened and why beside the relevant field.
- Visible hierarchy for primary/secondary/tertiary/destructive actions.
- Single-column forms unless tightly related controls justify a desktop pair.
- Controlled text line length.
- Adequate spacing.
- Distinct light/dark palettes.
- Never use color as the only signal.

---

## 9. Layout and responsive system

### Bootstrap breakpoints

Use current project breakpoints if documented; otherwise use Bootstrap defaults:

- `xs`: 0–575px
- `sm`: 576–767px
- `md`: 768–991px
- `lg`: 992–1199px
- `xl`: 1200–1399px
- `xxl`: 1400px+

Test at 360px, 390px, 768px, 1024px, 1280px, 1440px, and 1600px.

### Persistent app shell

```text
AppShell
├── DesktopSideNav / mobile OffcanvasNav
├── TopBar
├── MainContent
│   └── nested Router Outlet
└── ToastRegion
```

- Desktop side nav: 256px (acceptable range 248–272px).
- Main max width: 1440–1560px where applicable.
- Main padding: 20px mobile, 28px tablet, 32–48px desktop.
- `SideNav` and `TopBar` remain mounted between nested route changes.
- Only route content may transition.
- No full-screen loader for normal navigation.

### Information density

- Tables for logs, audit events, queues, telemetry, reports, and capacity.
- Metrics only when they answer an operational question.
- Use semantic surfaces: `data`, `action`, `alert`, `context`, `preview`; do not use one generic Card everywhere.
- A right rail must contain action or decision context; otherwise remove it.
- Do not make grids just because they look balanced.

---

## 10. Component system

Adapt names to the actual codebase, but build/consolidate these shared primitives.

### Foundations

- `AppShell`
- `SideNav`
- `MobileNav`
- `TopBar`
- `Breadcrumbs`
- `PageHeader`
- `SectionHeader`
- `ThemeToggle`
- `SkipToContent`

### Actions

- `AppButton`: `primary`, `secondary`, `tertiary`, `danger`, `ghost`, `icon`; sizes `sm`, `md`, `lg`.
- `IconButton`
- `ConfirmDialog`
- `ActionMenu`

### Data/navigation

- `StatusBadge` (icon + label)
- `DataTable`
- `ResponsiveDataList`
- `FilterBar`
- `SearchField`
- `DateRangeField`
- `Pagination`
- `MetricInline`
- `Timeline` only when chronology is central
- `ActivityFeed`
- `CommandPanel`
- `DetailDrawer`

### Feedback

- `InlineFieldError`
- `Toast`
- `LoadingState`
- `TableSkeleton`
- `EmptyState`
- `ErrorState`
- `OfflineNotice`
- `PermissionDeniedState`
- `NotFoundState`

### Forms

- `FormField`
- `SelectField`
- `DateField`
- `DateRangeField`
- `SensitiveField`
- `Stepper`
- `FormActions`

### Charts/visualization

Use existing chart tooling only. If none exists, create lightweight accessible SVG/CSS visualizations for confirmed data. Every chart needs a title, explanation, accessible label/tooltip, and text/table fallback. Do not hide urgent medical risk behind decorative charts.

---

## 11. Button standard

Buttons must not look like default Bootstrap buttons.

- Minimum height: 40px desktop; 44px touch.
- Radius: 8–10px.
- Weight: 600.
- Icon-label gap: 8px.
- Clear focus state.
- No oversized pills, gradients, or heavy shadows.
- No generic labels.

| Variant | Use | Examples |
|---|---|---|
| Primary | One dominant action | `Registrar manilla`, `Crear reserva`, `Guardar evaluación` |
| Secondary | Important non-dominant action | `Ver actividad`, `Guardar borrador` |
| Tertiary | Low-emphasis action/navigation | `Ver historial`, `Restablecer filtros` |
| Danger | Irreversible action | `Bloquear manilla`, `Revocar acceso` |
| Ghost | Compact/tertiary action | table action, theme toggle |
| Icon | Recognizable action with accessible name | buscar, exportar, abrir detalle |

Microinteraction:

- hover: `translateY(-1px)` maximum;
- pressed: `scale(0.98)` maximum;
- duration: 100–140ms;
- no bounce;
- respect reduced motion.

---

## 12. Motion and GSAP

### Motion purpose

Motion clarifies hierarchy, state change, spatial relationship, and progression. It must never be decorative noise.

```css
:root {
  --sg-motion-fast: 120ms;
  --sg-motion-base: 180ms;
  --sg-motion-slow: 240ms;
  --sg-ease-product: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### GSAP implementation rules

- Register `ScrollTrigger` only where required.
- Use `gsap.context()` inside each component.
- Call `context.revert()` on cleanup.
- Use `gsap.matchMedia()` for responsive animation variants.
- Honor `prefers-reduced-motion: reduce`.
- Animate `transform` and `opacity` first.
- Never animate normal interaction with `width`, `height`, `top`, `left`, or `transition: all`.
- No scroll-jacking, fake scrollbars, parallax overload, looping decorative animation, or expensive canvas effects.
- Do not animate every table row on initial load.
- Do not use ScrollTrigger inside security forms, dense tables, active medical alerts, or clinical workflows.

### Allowed motion areas

1. **Product overview / authenticated start page**
   - One editorial hero image reveal;
   - scroll section reveals;
   - product/module map animation;
   - choreography inspired by Landon Norris pacing, never copied;
   - maximum one pinned section only if mobile testing stays usable.

2. **App shell**
   - active nav indicator movement;
   - drawer fade/slide;
   - compact nested-route transition;
   - never reanimate the whole shell.

3. **Components**
   - buttons;
   - modals;
   - drawers;
   - toasts;
   - steppers;
   - short row-update highlight.

### Route transition standard

- Keep `AppShell`, `SideNav`, and `TopBar` mounted.
- Animate nested outlet only: opacity `0 → 1`, translateY `6px → 0`, ≤180ms.
- Do not put changing `key` values on layout/shell.
- Do not animate page exit when it delays urgent content.
- Do not use full-screen Suspense fallback for normal routes.

### Flicker/pantallazo audit

Before modifying motion, inspect for:

- `window.location.href`, raw anchors, or reloads;
- route keys/remounts;
- `key={pathname}` on layout;
- top-level `Suspense` replacing the app;
- global loading hiding layout;
- `transition: all`;
- unstable request/query keys;
- refetching every route change;
- uncleaned GSAP contexts;
- non-idempotent StrictMode effects;
- image layout shift;
- theme flash;
- late font swaps;
- router providers reinitializing.

Document the real cause and fix in `docs/frontend-navigation-performance.md`.

---

## 13. Routing and navigation

Use role-appropriate groups, not a flat list of every module. Adapt only after verifying existing routes and permissions.

```text
Inicio

OPERACIÓN
- Acceso NFC
- Sesiones activas
- Máquinas y telemetría
- Agenda y aforo

ATENCIÓN DEPORTIVA
- Deportistas
- Expediente clínico
- Alertas médicas
- Planes y revisiones
- Seguimiento nutricional

EXPERIENCIAS
- Exergames XR

ANÁLISIS
- Reportes
- Indicadores operativos

ADMINISTRACIÓN
- Usuarios y roles
- Privacidad y consentimientos
- Auditoría
- Configuración
```

Rules:

- Use `Link`, `NavLink`, and router APIs; never raw page reload navigation.
- Use nested routes beneath persistent `AppShell`.
- Use local route fallbacks rather than global app fallbacks.
- Preserve filters/pagination/selection in URL only when safe and meaningful.
- Never put NFC, HMAC, token, password, secret, sensitive health data, or private identifiers in URLs.
- Use `aria-current="page"`.
- Render routes only when confirmed contracts exist.

---

## 14. Role-aware experience

- Use confirmed authorization information only.
- The frontend may hide inaccessible actions for usability, but backend authorization remains authoritative.
- Never render sensitive data then hide it with CSS.
- Provide explicit `PermissionDeniedState`.
- Do not fabricate logged-in users/roles outside development fixtures/tests.

Critical workflows should take at most three interactions where requirements permit: open critical alert, block/replace NFC, open athlete plan, inspect nutrition restrictions, inspect disconnected gateway.

---

## 15. Module-specific UI requirements

### NFC identity/access

- Pages: overview, wristbands, activity, failed attempts, audit.
- Use tables, filter bars, action panels, secure forms.
- Never show NFC, HMAC, API keys, secrets, or credentials.
- Replacement is a guided stepper.
- Blocking/revocation uses explicit consequence copy and danger confirmation.
- Empty activity state lives inside table body, not huge empty cards.
- Status uses icon + text + color.

### Clinical record/risk

- Critical alerts outrank secondary metrics.
- Clear severity taxonomy.
- Avoid flashy motion and decorative imagery.
- Keep critical indicators visible during active sessions.
- Minimize health-data exposure in UI, logs, URLs, and screenshots.

### IoT/machines

- Machine states, event timelines, latency, sync status, gateways, and detail panels.
- Differentiate stale, delayed, disconnected, degraded, and normal.
- Do not fake live data with timers/random values.

### Plans/review/adherence

- Show status, reviewer, version, required action, next step.
- No AI visual clichés.
- Approval/rejection has explicit copy and traceability.

### Scheduling/capacity

- Accessible calendar/list only if actual contracts exist.
- Prioritize availability, occupancy, location, capacity, conflict prevention.
- Avoid tiny calendar cells on mobile.

### XR/exergames

- Restrained immersive visuals only in explainers/onboarding.
- Operational screens emphasize readiness, safety, compatibility, and session state.
- Never obscure medical warnings.

### Reports/governance

- Separate information analytics from actionable exceptions.
- Exports only if permission/endpoint exists.
- Audit pages are table-first and time-oriented.
- Consent/privacy flows use explicit copy and recorded state.

---

## 16. API integration rules

- Inspect API docs/OpenAPI/types before data-dependent UI.
- Never invent endpoint, query, field, ID, role, or production data.
- Keep fetch/API code out of presentational components.
- Use a dedicated client/service layer.
- Explicit adapters for inconsistent payloads.
- Handle loading, empty, partial, unauthorized, forbidden, offline, validation, conflict, server error, and retry states.
- Abort/ignore stale requests on context change where current stack supports it.
- Do not fake real-time telemetry, alerts, or machine state.
- Never expose secrets client-side.

---

## 17. Accessibility baseline

Meet WCAG 2.1 AA wherever practical.

- Semantic HTML first.
- `SkipToContent`.
- Labels for every input.
- Error next to field with explanation.
- Accessible icon names.
- Icon + label for complex actions.
- Logical focus order and persistent focus ring.
- Focus-trapped modals/drawers, Escape closes when safe.
- Explicit destructive action names.
- 44px touch targets.
- Contrast checks.
- Color is not the only signal.
- Tooltips do not hold essential-only information.
- Table captions/descriptions where needed.
- Charts include text/table summary.
- Reduced-motion support.
- Keyboard verification at every route/modal.

---

## 18. Performance and image budget

The dashboard must remain fast and responsive.

- Avoid huge images/videos.
- SVG for icons/small illustrations.
- AVIF/WebP for photos.
- Explicit image dimensions.
- Lazy-load below-the-fold visuals.
- Avoid expensive blur/shadows.
- Avoid deep remounts and app-shell rerenders.
- Stable keys.
- Route code splitting only where useful.
- Small GSAP scopes with cleanup.
- Test slow network/lower-power conditions when possible.
- Record bundle/runtime concerns in `docs/frontend-performance-report.md`.

---

## 19. Suggested folder structure

Adapt to repository conventions, but prefer feature boundaries and a shared design layer.

```text
src/
├── app/
│   ├── App.jsx|tsx
│   ├── router/
│   ├── providers/
│   └── layout/
├── assets/
│   ├── brand/
│   ├── images/
│   └── illustrations/
├── design/
│   ├── tokens.css
│   ├── themes.css
│   ├── bootstrap-overrides.scss|css
│   └── motion.css
├── components/
│   ├── actions/
│   ├── data-display/
│   ├── feedback/
│   ├── forms/
│   ├── navigation/
│   └── layout/
├── features/
│   ├── access-nfc/
│   ├── clinical-record/
│   ├── medical-risk/
│   ├── iot-machines/
│   ├── plans/
│   ├── review/
│   ├── adherence/
│   ├── exergames/
│   ├── scheduling/
│   ├── reports/
│   └── governance/
├── services/
│   ├── api/
│   └── adapters/
├── hooks/
├── utils/
├── test/
└── styles/
```

- One public component per file.
- Feature-specific components stay inside their feature.
- No circular dependencies.
- No junk-drawer utility file.
- No business logic in CSS or presentational components.
- No unused imports, dead files, `console.log`, or broad `any` types where TypeScript exists.

---

## 20. Visual QA protocol

For every completed screen, verify and document:

1. 1440px desktop.
2. 1024px laptop.
3. 768px tablet.
4. 390px and 360px mobile.
5. Light theme.
6. Dark theme.
7. Keyboard-only navigation.
8. Reduced motion.
9. Loading state.
10. Empty state.
11. Error state.
12. Permission denied state where applicable.
13. Long labels/names.
14. Slow image/network conditions.
15. No horizontal overflow.
16. No layout shift after font/image load.

Update `docs/frontend-visual-audit.md` with findings, fixes, and real remaining limitations.

---

## 21. Required documentation outputs

Maintain these documents:

```text
docs/frontend-skill-report.md
docs/frontend-baseline-audit.md
docs/frontend-implementation-plan.md
docs/frontend-visual-research.md
docs/frontend-assets-manifest.md
docs/brand-assets.md
docs/frontend-navigation-performance.md
docs/frontend-dependency-log.md
docs/frontend-performance-report.md
docs/frontend-visual-audit.md
docs/frontend-delivery-report.md
```

The delivery report must contain:

- pages completed;
- changed components;
- implemented routes;
- confirmed API dependencies;
- unavailable endpoints;
- added assets with provenance/license;
- skills used/unavailable;
- command output for lint/typecheck/tests/build;
- accessibility and responsive results;
- performance concerns;
- real external blockers;
- confirmation that backend/database/API contracts/AI implementation were not changed.

---

## 22. Final quality gate

Do not declare completion until all applicable items are true:

- [ ] `AGENTS.md` and `CLAUDE.md` read.
- [ ] Skill report factual and complete.
- [ ] Only React, Bootstrap, React Bootstrap, custom CSS/SCSS, GSAP, and existing approved packages are used.
- [ ] No AI dependency or AI implementation added.
- [ ] No backend/database/API contract modified.
- [ ] No generic dashboard/card-grid pattern remains without a functional reason.
- [ ] Light/dark themes and tokens implemented.
- [ ] UCACUE palette marked provisional unless official values verified.
- [ ] Brand assets documented.
- [ ] Images optimized, authorized, documented, and not copied from inspiration websites.
- [ ] App shell persists on nested route changes.
- [ ] Navigation flicker root cause documented and fixed.
- [ ] GSAP motion scoped, cleaned up, and reduced-motion compliant.
- [ ] Keyboard/focus/labels/modals/contrast/errors tested.
- [ ] Every relevant screen has loading, empty, error, and responsive states.
- [ ] No NFC, HMAC, tokens, secrets, passwords, or unnecessary sensitive health data appear in logs, URLs, mocks, screenshots, or UI.
- [ ] Lint, typecheck, tests, and build executed with actual results recorded.
- [ ] No real blocker hidden or simulated.
