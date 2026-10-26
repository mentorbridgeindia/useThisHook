# Growth checklist

Owner actions to grow npm downloads after Phase 1 in-repo discovery work. Not a commitment calendar.

Automated weekly signal (metrics, draft tutorial, docs audit) lives in [`growth/`](../growth/README.md) and runs via [`.github/workflows/growth.yml`](../.github/workflows/growth.yml). Drafts are for human review only.

## GitHub surface (once)

- [ ] Set repository Topics: `react`, `react-hooks`, `typescript`, `hooks`, `ssr`, `zero-dependency`, `vite`
- [ ] Enable **Discussions** (Settings → General → Features)
- [ ] Confirm the [Sponsor](https://github.com/sponsors/senthilkumar979) profile is active so `.github/FUNDING.yml` shows a working button
- [ ] Pin the playground link and a good-first-issue (if any) on the repo

## Content (2–3 posts)

Ship short posts on Dev.to / Hashnode / personal blog. Each post: problem → install → live demo link.

1. [ ] “Await `confirm()` in React without a UI kit” → [`useConfirm`](https://usethishook.mentorbridge.in/useConfirm)
2. [ ] “Promise-based wizards with `useStepFlow`” → [`useStepFlow`](https://usethishook.mentorbridge.in/useStepFlow)
3. [ ] “Zero-dependency React hooks that stay SSR-safe” → [docs home](https://usethishook.mentorbridge.in/)

Optional later: Next.js App Router recipe (see [ROADMAP.md](../ROADMAP.md)).

## Distribution loops (recurring)

- [ ] One launch-style post on r/reactjs (problem → demo → why zero-deps; avoid changelog spam)
- [ ] Cross-post notable releases to X / LinkedIn / Bluesky with a short playground clip — assets + captions in [`docs/social/`](./social/README.md)
- [ ] Submit to awesome-react-style lists and React newsletter tips once demos stay crisp
- [ ] Ask early users for a star + “used by” one-liner; add social proof to README when you have 2–3 real names

## Success signals (4–6 weeks)

- npm weekly downloads trending up (not only a single-version spike)
- GitHub stars / Discussions activity
- Organic traffic to confirm / prompt / overlay playground pages
- Referral traffic from Dev.to / Reddit / “confirm dialog react hook” style search
