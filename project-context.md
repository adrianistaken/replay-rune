
# Replay Checkup - Project Context

## One liner

Paste a Dota 2 match ID, pick your role, get a clean one page report with the top 3 fixes for your next game.

## Vision

Help everyday Dota players improve with fast, role-aware feedback that feels actionable, not overwhelming. Keep it simple and kind.

## Product goal

Deliver a single report page per match that includes:

-   A headline summary in plain English
    
-   Top 3 fixes tailored to the selected role
    
-   2 wins so the user feels motivated
    
-   A compact KPI grid with crude percentiles vs hero medians
    
-   A tiny timeline strip for at least one key timing, like first core item
    

## Users and use cases

-   Solo player who wants quick direction between games
    
-   Creator who needs a fast visual for reviews on stream or VOD
    
-   Stack captain who wants quick talking points for the team
    

## Scope for MVP

-   Input: match ID and role
    
-   Fetch: OpenDota match JSON directly from the browser
    
-   Compute: 6 to 10 KPIs and simple percentiles against local hero medians
    
-   Rules engine: table driven logic that produces up to 3 fixes
    
-   Output: one page report
    
-   History: store last 5 reports locally and show them on the home screen
    
-   Share: copyable link that encodes match and role in the URL
    

## Non goals for MVP

-   No login
    
-   No payments
    
-   No database
    
-   No background jobs
    
-   No replay file uploads
    

## Tech stack

-   Vue 3, TypeScript, Tailwind, Nuxt.js
    
-   Light client state only, keep it simple
        
-   Optional Cloudflare Worker proxy later if CORS or rate limits become painful
    

## External services

-   OpenDota public API for match data
    
-   STRATZ can be added later for timeline enrichment
    

## Architecture at a glance

1.  Home form collects match ID and role
    
2.  Report view fetches match JSON from OpenDota
    
3.  Identify the player row and compute KPIs
    
4.  Annotate with percentiles using a local hero medians JSON
    
5.  Apply rules to generate Top 3 fixes and pick 2 wins
    
6.  Render the report and save a small summary to local history
    
7.  If CORS issues happen, flip a flag and route through a single proxy endpoint
    

## Core data concepts

-   Role: pos1 to pos5, chosen by the user
    
-   KPIs: lh at 10, gpm, xpm, kill participation, hero damage per minute, tower damage per minute, observers placed, sentries placed, stacks, first core item timing in seconds, deaths per 10 minutes
    
-   Percentiles: crude mapping vs hero medians to avoid raw number whiplash
    
-   Report: a single page artifact with summary, fixes, wins, KPI grid, timeline markers
    

## KPI definitions and sources

From the match payload, per the selected player:

-   Last hits at 10 minutes if available, else approximate if possible
    
-   Gold per minute and XP per minute
    
-   Kill participation percent based on team kills
    
-   Hero damage per minute and tower damage per minute
    
-   Observers placed, sentries placed, and stacks if derivable
    
-   Deaths per 10 minutes
    
-   First core item timing based on purchase log and a price threshold, exclude boots
    

## Percentiles

-   Use local hero medians for a handful of popular heroes and an all heroes fallback
    
-   Map values below median to a 5 to 50 band and above median to a 50 to 95 band
    
-   Include a delta vs median where it makes sense, like seconds slower on first item
    

## Rules engine

-   Table driven conditions on KPI values, percentiles, or deltas
    
-   Optional role filters so advice matches pos1 to pos5
    
-   Rank fixes and return up to 3, fill with neutral wins if fewer match
    
-   Tone is prescriptive and encouraging, not judgmental
    

Example rule themes to include first:

-   Late first core item combined with weak early CS
    
-   Low vision tempo for supports
    
-   High deaths with low impact
    
-   Low last hits at 10 for cores
    

## Report UX and layout

-   Headline card: hero, role, one sentence summary
    
-   Top 3 fixes: short titles and one sentence details
    
-   Wins: two positive notes pulled from strongest percentiles
    
-   Timeline strip: first core item timing with delta vs median
    
-   KPI grid: compact cards with value and percentile badges
    
-   Copy link button and a back to home link
    

## Onboarding and history

-   First scan works without login
    
-   History shows last 5 reports from local storage
    
-   Shareable links reproduce the report by re-fetching and recomputing
    

## Error and empty states

-   Invalid match ID: show a friendly message and keep the form visible
    
-   Missing fields: render a partial report with a small banner
    
-   Rate limits or network errors: show a retry hint and short backoff guidance
    

## Performance budget
    
-   Keep the bundle light and avoid heavy chart libraries
    
-   Keep the number of network calls minimal
    

## Privacy and safety

-   No accounts in MVP, only local history in the browser
    
-   No storage of personal data or Steam IDs server side for MVP
    
-   If a proxy is added later, do not log user IPs or match contents beyond basic request metrics
    

## Success metrics

-   Time to first report
    
-   Completion rate from home to report
    
-   Distribution of rule hits to guide next rules to add
    
-   Number of repeat scans per user session
    
-   Qualitative feedback from a simple thumbs up or down on each fix
    

## Operating principles

-   Ship small, iterate quickly, measure real usage
    
-   Keep copy short and helpful
    
-   Prefer obvious defaults over configuration
    
-   Always end the report with clear next game actions