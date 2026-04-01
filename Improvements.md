# Hirevia Web Portal UI Improvements

This document focuses on the web portal located at `/Users/yannhometeam/Documents/Hirevia/web-portal`.

## Executive Summary

Hirevia's web portal already has a strong visual foundation. The dark premium theme, glass surfaces, motion, and typography create a more ambitious product feel than a typical MVP ATS dashboard. The main problem is not poor styling. The main problem is that the portal currently sits between two states:

- a polished product demo
- a real operational recruiting tool

Some screens feel production-ready in terms of visual design, while others still rely on mock patterns, placeholder content, or interaction-heavy concepts that reduce trust and usability. The portal should move toward clearer workflows, stronger information hierarchy, and more credible data presentation.

## Overall Product Direction

### What is already working

- The design system direction is strong and coherent.
- The shell layout feels premium and modern.
- The auth pages are polished and visually convincing.
- The jobs page has a solid structural foundation.

### What is not yet working

- Too many areas still feel demo-like rather than operational.
- Important decisions are sometimes hidden behind hover states or subtle controls.
- Some metrics and signals appear precise without being fully trustworthy.
- Workflow-heavy pages prioritize visual flair over recruiter efficiency.

## Global UI Issues

### 1. Trust and Data Credibility

This is the most important issue in the portal.

Several parts of the interface present data in a way that looks final and authoritative, even when the underlying values are partly synthetic, placeholder-based, or visually dramatized. In a hiring product, that weakens product trust very quickly.

Examples:

- Dashboard KPIs use generated trend chips and stylized sparklines.
- Recent hires and some people-related visuals rely on mock imagery.
- Topbar notifications are hardcoded.
- Search suggestions are hardcoded.
- Candidate scoring is prominent without a clear scoring explanation.

### Recommendation

- Remove fake-seeming metrics unless they are real.
- If data is incomplete, show simpler real counts instead of polished pseudo-analytics.
- Clearly label preview metrics if they are not yet production-grade.
- Only highlight scores if the system can explain how those scores are produced.

### 2. Interaction Model Is Too Hover-Dependent

Many key actions are subtle until hover or appear inside menus. This works visually, but slows down frequent HR workflows.

Examples:

- Row actions on the jobs page
- Candidate card actions in the pipeline
- Some scan-state indicators that only become strong on hover

### Recommendation

- Keep hover polish, but make primary actions visible by default.
- Show one clear main action per object.
- Use hover for enhancement, not discoverability.

### 3. Inconsistent Product Realism

The portal is visually consistent more than it is behaviorally consistent. Some pages act like a real work tool, while others act like concept screens.

### Recommendation

- Define a "production realism" standard for each page.
- Avoid feature shells that look complete but are not yet product-complete.
- Prefer fewer fully real workflows over more partially real ones.

### 4. Shell Needs More Operational Value

The layout shell is attractive, but still mostly decorative in product terms.

### Recommendation

- Add counts and attention indicators to navigation.
- Make search global across jobs, candidates, interviews, and actions.
- Make notifications actionable.
- Add keyboard-first productivity patterns only where they are real, not performative.

## Screen-by-Screen Analysis

## 1. App Shell

Files:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/AppShell.tsx`
- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Sidebar.tsx`
- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Topbar.tsx`

### What works

- Strong brand atmosphere
- Good use of spacing and glass layers
- Navigation is visually clear
- Mobile sidebar behavior is reasonable

### Issues

- Navigation has no workload intelligence
- Search is mostly UI shell, not a true product command layer
- Notifications are hardcoded and non-operational
- The shell feels premium but not yet fully useful

### Improvements

- Add nav badges for actionable counts
- Add contextual quick actions by page
- Turn search into a cross-entity search surface
- Make the topbar less "demo polished" and more productivity-oriented

### Redesign needed?

No full redesign needed. Improve and operationalize.

## 2. Dashboard

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/page.tsx`

### What works

- Strong first impression
- KPI card styling is polished
- Layout feels premium and modern
- Funnel visualization is readable

### Issues

- Too many metrics feel synthetic
- Trend chips and sparklines imply confidence that the product may not actually have
- Header is generic and not action-oriented
- The page is more "executive overview" than recruiter command center
- Some people/activity content feels mocked rather than operational

### Improvements

- Replace fake trend values with real counts or remove them
- Add priority action modules
- Show pending reviews, unscheduled interviews, and stalled jobs
- Rework dashboard around "what needs attention now"
- Use simpler visuals where data maturity is low

### Redesign needed?

Yes. This is a redesign candidate.

### Better dashboard structure

- Priority actions
- Pipeline snapshot
- Recruiter activity
- Upcoming interviews
- Jobs needing attention

## 3. Jobs Page

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/jobs/page.tsx`

### What works

- Table layout is appropriate for B2B density
- Status pill treatment is good
- Row structure is clear
- The page is closer to a real workflow than some other screens

### Issues

- Too many actions depend on hover
- The page does not surface urgency strongly enough
- Table density is fine, but page-level hierarchy could be better
- Important workflow actions are visually secondary

### Improvements

- Keep the table model
- Surface visible primary row actions
- Add more meaningful filters and saved views
- Highlight jobs with low applicants, stale activity, or blocked progress
- Consider split-pane interaction on larger screens

### Redesign needed?

No full redesign. Strong improvement pass recommended.

## 4. Candidates Pipeline

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/candidates/page.tsx`

### What works

- Visually impressive kanban board
- Candidate cards are attractive and branded
- Drawer concept is good
- Stage columns are easy to understand at a glance

### Issues

- The page is optimized for visual appeal more than recruiter throughput
- Cards are large relative to the amount of decision-useful information
- Match score is visually dominant without enough explanation
- Drag-and-drop is emphasized too strongly
- Hover-only actions reduce efficiency
- Candidate detail view looks polished, but should be more workbench-like

### Improvements

- Increase information density
- Reduce decorative emphasis and increase triage speed
- Keep drag-and-drop as optional, not primary
- Add stronger filtering and recruiter note visibility
- Improve drawer for real evaluation work

### Redesign needed?

Yes. This page should be redesigned around recruiter efficiency.

### Better pipeline direction

- Dense triage mode
- Clear stage actions
- Resume and notes side panel
- Faster shortlist/reject/schedule actions
- Stronger filtering by job, score, stage, and recruiter

## 5. Interviews Page

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/interviews/page.tsx`

### What works

- Scheduling board is visually refined
- Card styling is strong
- Drag interaction is intuitive at a concept level
- The page has a strong sense of product ambition

### Issues

- Hardcoded days and slot assumptions weaken realism
- The schedule board is more concept-driven than ops-driven
- It lacks deeper scheduling context
- The UI emphasizes motion and layout more than scheduling confidence

### Improvements

- Use real date and timezone logic
- Add candidate/interviewer context into scheduling flows
- Add list and calendar views
- Support interview prep and confirmation states
- Make rescheduling clearer and more reliable

### Redesign needed?

Yes. This screen needs a more operational scheduler model.

## 6. Auth Screens

Files:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/login/page.tsx`
- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/signup/page.tsx`

### What works

- Best visual work in the portal
- Strong brand presentation
- Good spacing and composition
- Clear hierarchy
- Premium look without feeling cheap

### Issues

- They are more polished than parts of the logged-in product
- The transition from auth to product interior feels slightly mismatched

### Improvements

- Keep the auth direction
- Borrow more of its compositional discipline inside the product
- Standardize product headers and empty states so the internal product feels as intentional

### Redesign needed?

No. Keep and align the rest of the portal upward.

## Design System Recommendations

Files:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/globals.css`

### Strengths

- Strong token base
- Reusable glass surface patterns
- Consistent dark premium mood

### Improvements

- Reduce one-off visual treatments
- Define standard card density levels
- Define standard page header patterns
- Define standard data-state patterns
- Limit decorative glow use to high-value surfaces
- Make metric cards and operational cards visually distinct

## Recommended Priorities

### Priority 1

- Remove or rework fake-looking metrics, alerts, and suggestions
- Improve data trust across the portal

### Priority 2

- Redesign dashboard into a recruiter operations hub

### Priority 3

- Redesign candidates pipeline around speed and decision-making

### Priority 4

- Redesign interviews around real scheduling workflows

### Priority 5

- Standardize patterns across jobs, dashboard, pipeline, and interviews

## Keep / Improve / Redesign Summary

### Keep

- Visual brand direction
- Dark premium shell
- Typography foundation
- Auth page design
- Jobs table foundation

### Improve

- Sidebar usefulness
- Topbar usefulness
- Jobs workflow clarity
- Data-state handling
- Product consistency

### Redesign

- Dashboard
- Candidates pipeline
- Interviews scheduler

## Final Recommendation

Hirevia's web portal does not need a full visual reset. It needs a product maturity pass.

The best path is:

- keep the design language
- remove low-trust or placeholder-feeling elements
- redesign the workflow-heavy screens around clarity and speed
- make the product feel less like a premium concept and more like a premium operating system for recruiters

## Updated Direction Based on Product Preference

Pipeline and interviews should stay directionally as they are.

That changes the priority of the review:

- keep the candidates pipeline as one of the strongest product expressions
- keep the interviews screen as another strong, distinctive product surface
- improve dashboard, jobs, shell, and trust consistency so they rise to the same standard

The portal's main design problem is now less about "which pages to redesign entirely" and more about "how to make the rest of the product feel as confident as the strongest two screens."

## In-Depth: Where the Portal Is Lacking and What To Do

## 1. Dashboard Is the Weakest Screen

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/page.tsx`

### Where it is lacking

- It looks polished, but not fully trustworthy.
- It behaves more like a startup demo dashboard than a recruiter command center.
- A lot of the value is visual rather than operational.
- It tells the user what is happening in broad terms, but not what needs attention now.
- Some KPI presentation feels synthetic or overly dramatized.

### Why that hurts

In a hiring product, the dashboard should create confidence. If the page looks premium but the logic behind the numbers feels vague, the user starts distrusting the screen and eventually the product.

### What to do

Redesign the dashboard around recruiter action rather than generic business analytics.

It should prioritize:

- candidates awaiting review
- interviews needing confirmation
- jobs with weak applicant flow
- jobs with stalled movement
- recent recruiter activity
- upcoming interview commitments

### Better dashboard structure

- top row: urgent actions
- second row: pipeline health snapshot
- secondary section: upcoming interviews and pending actions
- lower section: recent movement and recruiter activity

### Design direction

Keep the premium dark styling, but reduce the sense of fake executive analytics. The dashboard should feel more useful, more grounded, and more real.

## 2. Jobs Page Is Good, But Too Passive

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/app/jobs/page.tsx`

### Where it is lacking

- The structure is good, but the workflow energy is too low.
- Primary actions are too hidden.
- Too much relies on hover.
- The page does not clearly tell the recruiter which jobs are healthy, urgent, weak, or blocked.

### What works already

- Table layout is appropriate for B2B density.
- Status treatment is strong.
- Data presentation is cleaner and more credible than the dashboard.

### Why it still feels weaker than pipeline and interviews

Pipeline and interviews feel alive. Jobs feels static.

### What to do

Keep the table model, but add operational intelligence.

Examples:

- low application volume
- stale posts
- jobs nearing expiration
- too many rejected applicants
- jobs stuck without movement

Make actions more obvious:

- open pipeline
- edit job
- pause or close
- duplicate job

### Design direction

Do not redesign this screen from scratch. Instead, make it more proactive, more visible, and more decision-supportive.

## 3. Sidebar Looks Good But Does Not Help Enough

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Sidebar.tsx`

### Where it is lacking

- It is visually strong but functionally quiet.
- It does not communicate workload, urgency, or attention states.
- It feels like navigation only, not a useful operating surface.

### Why it matters

In recruiting software, navigation can also communicate live system state. The sidebar can tell the recruiter where attention is needed before they even open the page.

### What to do

Add lightweight intelligence:

- badge counts for new candidates
- today interview counts
- jobs needing action
- subtle attention states on important sections

Also improve the user block:

- add workspace relevance
- make it feel more useful and less decorative

### Design direction

Keep the visual design. Improve its usefulness.

## 4. Topbar Feels Premium But Still Too Fake

File:

- `/Users/yannhometeam/Documents/Hirevia/web-portal/src/components/layout/Topbar.tsx`

### Where it is lacking

- Search suggestions are mock-like.
- Notifications are hardcoded.
- The UI says premium SaaS, but the behavior still says concept shell.
- Search looks advanced, but is not yet a true productivity tool.

### Why it feels off

This is one of the clearest places where styling has advanced faster than product behavior.

### What to do

Turn the topbar into a real utility layer.

Search should support:

- jobs
- candidates
- interviews
- key actions or destinations

Notifications should become:

- real
- actionable
- tied to platform events

### Design direction

Keep the layout and feel. Replace placeholder-feeling utility patterns with real product behavior.

## 5. Product Consistency Is the Main Design Problem

This is the biggest issue once pipeline and interviews are intentionally preserved.

### Current state

- candidates and interviews feel like premium product screens
- dashboard and jobs feel more conventional
- shell is visually polished but not fully operational

### What this creates

The experience feels uneven. The user moves between strong hero screens and more standard admin screens, which weakens overall brand confidence.

### What to do

Adopt the strongest screens as the product benchmark:

- keep the confidence of pipeline and interviews
- bring dashboard, jobs, and shell up to that level
- do not flatten the stronger screens just to create consistency

This means improving:

- hierarchy
- realism
- action clarity
- product usefulness
- information confidence

## 6. Trust Is More Important Than More Polish

The portal already has enough visual polish to feel premium. What it now needs most is credibility.

### Current risk

Some parts of the UI may make users think:

- this looks great, but is it real
- are these metrics actually meaningful
- is this score trustworthy
- is this a working product or a polished MVP

That is especially risky in HR software, where users are making people-impacting decisions.

### What to do

Every major page should answer:

- what is real
- what changed
- what needs action
- what the next best step is

If a signal is not fully mature:

- simplify it
- label it clearly
- or remove it

## 7. Revised Priority Order

If the goal is to improve the portal while keeping pipeline and interviews directionally intact, the best order is:

1. Dashboard redesign
2. Jobs page improvement
3. Sidebar and topbar operational pass
4. Trust cleanup across metrics, notifications, and search
5. Cross-product consistency pass

## Bottom Line

The portal is not lacking design taste.

It is mainly lacking:

- stronger product realism
- stronger action hierarchy
- stronger consistency outside its best screens

Put simply:

- candidates and interviews feel like the future of the product
- dashboard, jobs, and shell need to catch up
