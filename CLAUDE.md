# CLAUDE.md — SmartGym Frontend Entry Instructions

## Mandatory first action

Read `AGENTS.md` completely before inspecting or changing any frontend file.

`AGENTS.md` is the complete operating specification for the SmartGym frontend. Its scope, technical restrictions, visual requirements, asset policy, motion rules, accessibility requirements, and quality gates are mandatory.

## Frontend-only scope

Work only on the React frontend.

Do not modify:

- backend code;
- Java/Spring code;
- database code;
- Supabase configuration;
- API endpoints or payload contracts;
- authentication/authorization backend logic;
- infrastructure;
- environment secrets;
- GitHub settings;
- CI/CD;
- branches or commits.

Do not implement:

- AI models;
- LLMs;
- chatbots;
- OpenAI;
- machine learning;
- inference;
- recommendation engines;
- fake AI behavior.

The UI may render data from an already-existing backend AI module only when a confirmed API contract exists.

## Required skill discovery

Before coding:

1. Run the environment's actual `find-skills` workflow.
2. Search for these exact names:
   - `impeccable design`
   - `wondel.ai skills`
   - `emil kowalski`
   - `taste skill`
   - `frontend-design`
   - `accessibility`
   - `react performance`
   - `gsap`
3. Use only skills that genuinely exist.
4. Do not fabricate skill availability.
5. Create `docs/frontend-skill-report.md` before the first implementation change.

## Required technology

Use only:

- React;
- the current project React Router configuration;
- Bootstrap;
- React Bootstrap;
- project CSS/SCSS;
- GSAP when motion is justified;
- existing approved dependencies.

Do not add Tailwind, Material UI, Chakra, shadcn, Framer Motion, another UI system, another animation framework, a chart library, or an AI package without explicit user approval.

## Execution order

1. Read `AGENTS.md`.
2. Inspect repository and frontend baseline.
3. Discover skills and create the skill report.
4. Create the visual baseline audit.
5. Research references/assets under the AGENTS.md rules.
6. Write the implementation plan.
7. Implement design tokens, themes, persistent AppShell, shared component primitives, routing stability, and GSAP foundation.
8. Implement module interfaces in product-priority order using confirmed contracts only.
9. Validate each phase with lint, typecheck, tests, build, responsive checks, accessibility checks, and reduced-motion checks.
10. Update every required documentation file.
11. Create `docs/frontend-delivery-report.md` with factual results.

## Non-negotiable behavior

- Do not create a generic card-grid dashboard.
- Do not use decorative gradients, glassmorphism, generic stock-photo hero sections, mascots, robots, or empty visual filler.
- Do not copy layouts, source code, screenshots, images, or animations from Awwwards, Dribbble, Landon Norris, or any external reference.
- Use external references only to learn design principles and document adaptations.
- Do not invent endpoints, fields, data, roles, or production mock data.
- Do not use page reload navigation or remount the AppShell between routes.
- Do not use `transition: all`.
- Do not add a full-screen loader for standard route navigation.
- Do not use photos in clinical, audit, access-log, security-form, or active-alert workflows.
- Do not display NFC values, HMACs, tokens, API keys, passwords, private identifiers, or sensitive clinical details unnecessarily.
- Do not claim a result is complete without command output and documented evidence.

## Definition of done

The frontend is complete only after all relevant AGENTS.md quality checks pass and `docs/frontend-delivery-report.md` records:

- skills;
- files changed;
- routes/pages;
- assets;
- visual research;
- API dependencies;
- responsive checks;
- accessibility checks;
- performance observations;
- lint;
- typecheck;
- tests;
- build;
- real remaining blockers.
