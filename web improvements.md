# Hirevia Web Improvements

This document focuses only on the Hirevia web portal located at `/Users/yannhometeam/Documents/Hirevia/web-portal`.

Pipeline and interviews are intentionally kept directionally as they are. The purpose of this document is to explain in depth where the rest of the web portal is lacking, why it feels uneven, and what should be improved.

## Core Observation

The web portal already has two strong screens:

- candidates pipeline
- interviews

Those two screens feel like the most designed, most distinctive, and most product-confident parts of the portal.

The issue is that the rest of the portal does not consistently match that level.

So the current experience feels uneven:

- pipeline and interviews feel like the future of the product
- dashboard, jobs, and parts of the shell feel more conventional or partially productized

That mismatch is the main problem to solve.

## 1. Dashboard Is the Weakest Screen

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/page.tsx`

### Where it is lacking

- It looks polished, but not fully trustworthy.
- It feels more like a startup demo dashboard than a recruiter command center.
- It prioritizes visual KPI presentation over operational usefulness.
- It does not help the recruiter quickly answer: what needs my attention right now?
- Some KPI logic and presentation feels synthetic rather than deeply product-grounded.

### Why that hurts

In a recruiting product, the dashboard is supposed to create confidence. If the numbers feel polished but not fully believable, the user starts distrusting the product. Once trust drops, even good design starts feeling cosmetic.

### What to do

Redesign the dashboard around action and operational clarity.

It should prioritize:

- candidates awaiting review
- interviews needing confirmation
- jobs with weak applicant flow
- jobs with stalled movement
- recent recruiter activity
- upcoming interview commitments

### Better structure

- top row: urgent attention cards
- second row: pipeline snapshot
- side or lower section: upcoming interviews
- lower section: recruiter activity and recent candidate movement

### Visual direction

Keep the premium dark aesthetic, but reduce the fake executive-dashboard energy. The dashboard should feel more useful, more grounded, and more credible.

## 2. Jobs Page Is Good, But Too Passive

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/jobs/page.tsx`

### Where it is lacking

- The table structure is good, but the workflow energy is too low.
- Important actions are too hidden.
- Too much depends on hover states.
- The page does not clearly show which jobs are healthy, urgent, weak, or blocked.
- It feels like a clean listing page rather than a proactive recruiting workspace.

### What works

- Table format is appropriate for B2B density.
- Status treatments are strong.
- The data presentation is cleaner and more credible than the dashboard.

### Why it still feels weaker than pipeline and interviews

Pipeline and interviews feel alive and operational. Jobs feels static.

### What to do

Keep the table model, but make it more intelligent and more action-oriented.

Examples of what to surface:

- low application volume
- stale jobs
- jobs nearing expiration
- jobs with too many rejected applicants
- jobs with no movement for a while

Primary actions should also be more obvious:

- open pipeline
- edit job
- pause or close job
- duplicate job

### Design direction

Do not redesign this page from scratch. Improve it so it feels more proactive and aligned with the stronger product screens.

## 3. Sidebar Looks Good But Does Not Help Enough

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Sidebar.tsx`

### Where it is lacking

- It is visually strong, but functionally quiet.
- It does not communicate urgency, counts, or workload.
- It acts as navigation only, not as an operational surface.

### Why it matters

In recruiting software, the sidebar can do more than route between pages. It can tell the recruiter where attention is needed before they even open that page.

### What to do

Add lightweight intelligence:

- badge counts for new candidates
- today interview counts
- jobs needing action
- subtle attention indicators

Also improve the user/workspace block so it feels useful rather than decorative.

### Design direction

Keep the visual style. Improve usefulness and system awareness.

## 4. Topbar Feels Premium But Still Too Fake

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Topbar.tsx`

### Where it is lacking

- Search suggestions feel mock-like.
- Notifications are hardcoded.
- The topbar looks advanced, but behaves like a concept shell in parts.
- Search is visually nice, but not yet a true productivity tool.

### Why it feels off

This is one of the clearest areas where styling has advanced faster than product behavior.

### What to do

Turn the topbar into a real utility layer.

Search should support:

- jobs
- candidates
- interviews
- relevant actions or destinations

Notifications should become:

- real
- actionable
- tied to actual product events

### Design direction

Keep the look and layout. Replace placeholder-feeling utility elements with real product behavior.

## 5. Product Consistency Is the Main Design Problem

This is the biggest issue once pipeline and interviews are intentionally preserved.

### Current state

- candidates and interviews feel like premium hero product screens
- dashboard and jobs feel more conventional
- shell is visually polished but not fully operational

### What this creates

The portal feels uneven. Users move between highly designed workflow pages and more standard admin-style pages, which weakens overall product confidence.

### What to do

Treat the strongest screens as the benchmark:

- keep the confidence of pipeline and interviews
- bring dashboard, jobs, and shell up to that level
- do not flatten the stronger screens just to create consistency

The product should become more consistent in:

- hierarchy
- realism
- action clarity
- information confidence
- usefulness

## 6. Trust Matters More Than More Polish

The portal is already polished enough visually to feel premium. What it needs now is credibility.

### Current risk

Some parts of the interface may make users think:

- this looks nice, but is it real
- are these metrics actually meaningful
- is this score trustworthy
- is this a polished MVP instead of a mature product

That is especially risky in HR software, where users are making decisions that affect real people.

### What to do

Each major page should answer:

- what is real
- what changed
- what needs action
- what the next best step is

If a signal is not mature enough:

- simplify it
- label it
- or remove it

## 7. Revised Priority Order

If the goal is to improve the portal while keeping pipeline and interviews directionally intact, the best order is:

1. Dashboard redesign
2. Jobs page improvement
3. Sidebar and topbar operational pass
4. Trust cleanup across metrics, notifications, and search
5. Cross-product consistency pass

## Bottom Line

The web portal is not lacking design taste.

It is mainly lacking:

- stronger product realism
- stronger action hierarchy
- stronger consistency outside its best screens

Put simply:

- candidates and interviews feel like the future of the product
- dashboard, jobs, and shell need to catch up

