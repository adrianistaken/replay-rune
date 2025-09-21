
# Replay Rune – New Feature Implementation Context

We want to add **two new key features** to Replay Rune:

## 1. Rank Average Comparison Switching
- By default, users see comparisons against their own rank (taken from the match data).
- Add a **drop-down selector** that allows users to switch and see their performance compared to other rank averages.
- The drop-down options should reflect the bracket groupings available from the GraphQL API:
  - HERALD_GUARDIAN
  - CRUSADER_ARCHON
  - LEGEND_ANCIENT
  - DIVINE_IMMORTAL
- Each option will display metrics from that grouping.
- Important: close ranks will have similar performance, so grouping is fine.  

## 2. Minute-by-Minute Feedback (Slider)
- Provide a **time slider** (0 → game end).
- The slider shows how the player’s stats at that point in time compare to the selected rank’s averages.
- Default = last minute of the game (end of match stats).
- Updating the slider should dynamically update the displayed feedback.

---

## Data Requirements

### Existing (from initial match query)
- We already get `heroAverage` for the player’s current rank in the initial `match` API call.

### New (for all other ranks)
We need to run a GraphQL query to gather bracket averages across time. This is an example:

```graphql
query {
  heroStats {
    stats(
      heroIds: 2
      bracketBasicIds: [HERALD_GUARDIAN]
      positionIds: POSITION_1
      minTime: 0
      groupByTime: true
      groupByBracket: true
    ) {
      week
      matchCount
      heroId
      time
      position
      bracketBasicIds
      mvp
      topCore
      topSupport
      courierKills
      apm

      # Economy and progression
      goldPerMinute
      xp
      level
      networth
      supportGold

      # Combat
      kills
      deaths
      assists
      damage
      heroDamage
      towerDamage
      abilityCasts
      casts
      kDAAverage
      killContributionAverage

      # Farming and support actions
      cs
      dn
      campsStacked

      # Healing
      healingSelf
      healingAllies
      healingItemSelf
      healingItemAllies
    }
  }
}
```

- heroIds: should match the player’s hero.
- bracketBasicIds: query all relevant groups (see mapping below).
- groupByTime: true ensures we can feed the minute-by-minute slider.

The response structure mirrors the heroAverage object we already use.

### Bracket Mapping
The `match.bracket` field gives us a number (0–8). We need to get this data from the original API call data and map this to bracket strings. Example mapping:

```
{
  "0": "UNRANKED",
  "1": "HERALD",
  "2": "GUARDIAN",
  "3": "CRUSADER",
  "4": "ARCHON",
  "5": "LEGEND",
  "6": "ANCIENT",
  "7": "DIVINE",
  "8": "IMMORTAL"
}
```
- Unranked games can be identified with match.lobbyType = "UNRANKED".
- GraphQL requires paired bracket groupings (e.g. `HERALD_GUARDIAN`).
- We’ll need string manipulation or mapping logic to pair the single rank into its grouping. Or another way that you seem better.
- Since we can only query for two ranks at a time, the easiest solution is to always query all bracket groups once per report. Do this as another API call after the user clicks Analyze Match. This will happen in the background while the loader is spinning and they're waiting for their report to finish.

### Notes / Constraints
- FILTERED and ALL do not return usable data → skip.
- Always query for full bracket groups to avoid missing data.
- The drop-down options should directly map to bracket groupings in the query response.
- UI should clearly default to the user’s rank bracket grouping on first load.

### Implementation Goals
#### Backend/Data Layer
- Add GraphQL query for bracket averages grouped by time and bracket.
- Cache/store these results so the front end can access them without repeat queries per user interaction.
- Ensure this data and original API call match data is stored in a way that doesn't require recalling the API when a recent report is opened.

#### Frontend
- Drop-down for bracket comparison switching.
- Time slider for minute-by-minute feedback.
- Default state = user’s bracket + end-of-match minute.
- New drop-down and timer slider are at the top of the report, but under the section that includes the hero name, match ID, and that other information.
- Ensure styling matches existing styling so it fits and doesn't look out of place.