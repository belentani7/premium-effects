---
name: premium-effects-registry
description: Find curated, publicly verified GitHub references for frontend visual effects, shaders, WebGL, animation, and design materials without network calls during search.
---

# Premium Effects Registry

## Purpose
Find a **relevant, working reference project** before choosing a visual effect library. This is a design-resource registry, not a ready-to-install effect pack; each linked project has its own license and security requirements.

## Usage
From the repository root with Node.js 18+:

```bash
node bin/effects.cjs --categories
node bin/effects.cjs "liquid metal"
node bin/effects.cjs "GLSL noise" --json
node bin/effects.cjs --category 3d-webgl
npm test
```

Search is deterministic and local, without API keys, telemetry, payments or network calls. The initial catalog has **11 URLs verified as public/non-archived on 2026-10-23** through GitHub metadata; unlike the earlier README, do not claim 50+ verified entries until they have been individually checked.

## Decision logic
1. Clarify target medium: DOM/CSS, Canvas 2D, WebGL/Three.js or illustration-only.
2. Search by design objective and performance budget; prefer CSS where a 3D scene is unnecessary.
3. Inspect each candidate repo's *current* license, maintenance, accessibility and browser support **before copying code**. Verify README claims and assets in their original projects.
4. Prototype locally using the smallest viable effect. Apply reduced-motion fallback, mobile-safe GPU settings and progressive enhancement.
5. Measure FPS, largest contentful paint and interaction stability on a representative low-power device. Test offline/error fallback.
6. Attribute original authors and comply with the actual project license. Never treat a listing in this registry as permission to republish someone else's assets.

## Categories
`3d-webgl`, `motion`, `particles`, `creative-coding`, `liquid-morph`, `shaders`, `futuristic-ui`, `typography`, `glass-ui`.

## Updating
- Verify the GitHub URL exists publicly and is not archived.
- Add one entry to `catalog.json` with stable id, category, tags and use case.
- Add regression cases to `tests/registry.test.cjs`.
- Update `verifiedAt` accurately for records rechecked.
- Keep a clear distinction between registry metadata, implementation-ready code and concepts.
