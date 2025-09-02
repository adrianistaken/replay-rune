# Changelog

## [4.1.0] - 2024-12-19

### Fixed
- **"What You Did Well" Points**: Fixed issue where win points were not showing up in reports
  - **Restored time-based rules**: Brought back the original ruleset that uses minute-by-minute data
  - **Proper data structure usage**: Fixed StratzRuleEngine to correctly use `player.heroAverage` array data
  - **Time-specific KPIs**: Rules now properly evaluate metrics like `cs@10`, `xp@10`, `networth@20`
  - **Hero average comparison**: Engine now finds the correct hero average data for each specific game minute
  - **Closest time matching**: When exact time match isn't found, uses closest available time below target
- **Cumulative Value Calculations**: Fixed critical bug in player value calculations
  - **Per-minute vs Cumulative**: STRATZ `player.stats` arrays contain per-minute values, not cumulative
  - **Correct accumulation**: Now properly sums values from index 0 to target time for metrics like CS, XP, gold
  - **Affected metrics**: CS, XP, networth, and camp stacking now calculate correctly
  - **Example fix**: CS at 10 minutes now shows total accumulated CS (0+1+2+...+10) instead of just CS at minute 10
- **Net Worth Accuracy**: Added direct networthPerMinute support for precise time-based comparisons
  - **GraphQL query**: Added `networthPerMinute` field to STRATZ API request
  - **Direct access**: Net worth at specific times now uses actual cumulative net worth data
  - **No approximation**: Eliminates the gold-to-networth conversion that was inaccurate
  - **Better rules**: Net worth rules (like "networth@20") now use precise data for accurate comparisons

### Improved
- **Console Log Cleanup**: Removed excessive console logs throughout the application
  - **StratzRuleEngine**: Kept only essential timing information for rule engine analysis
  - **Stratz Service**: Removed verbose debugging logs, kept only error logging
  - **Report Pages**: Cleaned up page loading and analysis logs
  - **Index Page**: Removed excessive fetch and analysis logs
  - **Better debugging**: Console now shows only important information like API calls and errors
- **Enhanced Win/Fix Descriptions**: Added transparent comparison data to each win and fix point
  - **Value comparison**: Shows player's actual value vs hero average (e.g., "85 vs 72 average")
  - **Percentage difference**: Displays how much above/below average the player performed
  - **Time context**: Indicates when the comparison was made (e.g., "at 10 minutes")
  - **Clean formatting**: Easy-to-read format: "(85 vs 72 average - 18.1% above average at 10 minutes)"
- **Simple Debugging Logs**: Added minimal logging for STRATZ API data
  - **API Response**: Simple console log showing the STRATZ API response data
  - **Clean Output**: Just the essential data without excessive detail

### Technical
- **Rule Evaluation**: Fixed rule engine to properly handle time-based KPIs
  - **Minute-by-minute data**: Now correctly uses `heroAverage` array with `time` property
  - **Time matching**: Finds hero average data for specific game minutes (10, 15, 20 minutes)
  - **Data availability**: Rules now work with the actual STRATZ data structure
  - **Fallback handling**: Better handling when exact time data isn't available

## [4.0.0] - 2024-12-19

### Major Refactor
- **New V3 Ruleset System**: Completely refactored analysis engine to use deterministic ruleset-based approach
  - **Ruleset-driven analysis**: All analysis now based on `ruleset.v3.jsonc` configuration
  - **Delta-based comparisons**: Uses percentage differences from hero averages instead of percentiles
  - **Time-specific rules**: Rules evaluate performance at specific game minutes (10, 15, 20 minutes)
  - **Role-specific rules**: Different rules for each position (POSITION_1, POSITION_2, etc.)
  - **Deterministic results**: Same data always produces same analysis results

### Changed
- **Analysis Engine**: Replaced hero average rule engine with new v3 rule engine
  - **StratzRuleEngine**: New engine that loads and evaluates v3 ruleset
  - **Rule evaluation**: Supports `delta_less_than` and `delta_greater_than` operators
  - **KPI parsing**: Handles time-specific KPIs like `kDA@20`, `cs@10`, `networth@20`
  - **Hero average integration**: Properly uses STRATZ heroAverage data for comparisons
- **Report Structure**: Simplified report to show exactly 2 wins and 3 fixes
  - **Consistent output**: Every report shows exactly 2 "What You Did Well" points
  - **Focused feedback**: Every report shows exactly 3 "Fixes for Next Game" points
  - **Removed sections**: Eliminated "Key Timings" and "Numbers That Matter" sections
  - **Streamlined UI**: Cleaner, more focused report layout

### Technical
- **New Rule Format**: Rules now use `atMin`, `when`, and `text` fields
- **Delta Calculations**: Percentage differences calculated as `(player - average) / average`
- **Time Matching**: Finds closest hero average data for specific game minutes
- **Role Mapping**: Maps player roles to rule position requirements
- **Error Handling**: Graceful handling of missing hero average data

## [3.1.9] - 2024-12-19

### Enhanced
- **Advanced Caching System**: Improved performance and reduced API costs with multi-level caching
  - **Two-tier caching**: Raw match data cached separately from analysis results
  - **Match data reuse**: Same match can be analyzed for different heroes/roles without API calls
  - **Automatic cleanup**: Old cache entries automatically removed to prevent localStorage overflow
  - **Performance optimization**: Subsequent report views load instantly from cache
  - **Cost reduction**: Significantly reduces STRATZ API calls for repeated analysis

## [3.1.8] - 2024-12-19

### Enhanced
- **Improved Hover Effects**: Added subtle hover effects to previous reports
  - Enhanced border color change on hover (accent-primary/30)
  - Added background color change on hover (dark-panel/80)
  - Added subtle scale effect (1.02x) for better visual feedback
  - Improved transition duration (200ms) for smooth animations
  - Applied to both home page and history page for consistency

## [3.1.7] - 2024-12-19

### Changed
- **Real STRATZ API Integration**: Disabled example data and enabled real STRATZ API usage
  - Set `useExampleData = false` to use actual STRATZ API calls
  - Improved error handling for API configuration issues
  - Added better logging to track real API usage
  - Removed debug information from UI for cleaner production experience
  - App now fetches real match data from STRATZ API for each match ID

### Fixed
- **Match Data Refresh Issue**: Fixed the problem where entering a new match ID would show old data
  - Added automatic form reset when loading new match data
  - Modified example data to use the requested match ID
  - Added success message to confirm when match data is loaded
  - Improved visual feedback during loading process
  - Each new match ID now shows fresh data instead of cached example data

## [3.1.5] - 2024-12-19

### Fixed
- **Load Match Button Issue**: Fixed the "Load Match" button not working
  - Enabled example data fallback when STRATZ API is not configured
  - Added debugging information to help identify issues
  - Improved error handling and user feedback
  - Button now works with example data for testing purposes

## [3.1.4] - 2024-12-19

### Added
- **Consistent Share Button Design**: Updated all share buttons to use the same SVG icon design
  - Report pages now use the same share icon as history page
  - Added share button to home page recent reports section
  - Consistent hover states and visual feedback across all pages
- **Clickable App Name**: Made the "Replay Rune" app name in the navigation bar clickable
  - Links to the home page for easy navigation
  - Added hover effect for better user experience
- **Report Caching System**: Implemented intelligent caching to prevent unnecessary API calls
  - Reports are cached in localStorage with unique keys
  - Reopening reports uses cached data instead of making new API calls
  - Improves performance and reduces API usage
- **Subscription Feature Preview**: Added preview of subscription functionality
  - Home page shows only 2 most recent reports when more exist
  - Additional reports are blurred with subscription overlay
  - "Subscribe to See All Reports" button links to subscribe page
  - Demonstrates how the subscription feature would work

### Fixed
- **Analyze Button Issue**: Fixed the analyze match button not working properly
  - Added proper validation for match ID and hero selection
  - Improved button disabled state logic with better user feedback
  - Added dynamic button text to guide users through the selection process
  - Added debugging information to help identify issues

### Changed
- **Enhanced History Page**: Updated history page to match home page format and layout
  - Added hero images to history entries for better visual identification
  - Improved layout with consistent spacing and styling
  - Better visual hierarchy with hero images and role information
- **Improved Delete Confirmation**: Added confirmation dialogs for all delete actions
  - Individual report deletion now shows specific hero and match information
  - Clear all history shows warning about irreversible action
  - Prevents accidental deletion of analysis data

## [3.1.1] - 2024-12-19

### Changed
- **Improved User Experience**: Reordered report sections to start with positive feedback
  - "What You Did Well" section now appears before "Fixes for Next Game"
  - Creates a more positive and motivating user experience
  - Users see their strengths first, then areas for improvement

## [3.1.0] - 2024-12-19

### Added
- **Data Source Transparency**: All wins and fixes now include brief explanations of where the data comes from
- **STRATZ Hero Average Integration**: All comparisons now properly use STRATZ heroAverage array data
- **Time-based Comparisons**: GPM, XPM, and other metrics are compared against time-specific hero averages
- **Support Metrics**: Added camp stacking comparisons for support roles using STRATZ data

### Changed
- **Hero Average Calculations**: Updated to use cumulative networth and XP data from STRATZ heroAverage
- **First Core Timing**: Now estimated from networth progression in heroAverage data
- **Kill Participation**: Calculated using cumulative kills and deaths from heroAverage
- **Data Source Display**: Added small notes next to each win/fix explaining the data source
- **Numbers That Matter**: All metrics now show "STRATZ X minutes average" as data source
- **Enhanced Data Source Explanations**: Made all data source explanations more specific and informative
  - Now clearly state "Your [metric] vs STRATZ [time] average for this hero"
  - Include hero name and role in Numbers That Matter data sources
  - Distinguish between STRATZ averages and match data sources
- **Improved User Experience**: Separated plain English explanations from technical data sources
  - Main text shows user-friendly explanations without technical jargon
  - Sub-text shows technical data sources for transparency
  - Examples: "Based on your gold per minute compared to how other players perform on this hero"

### Technical
- **Enhanced Rule Engine**: Improved heroAverage data processing with proper time matching
- **Data Source Generation**: Added methods to explain data sources for transparency
- **Updated Ruleset**: Added explicit dataSource fields to all rules
- **Improved Calculations**: Better handling of cumulative vs per-minute metrics

## [3.0.0] - 2024-12-19

### Added
- **Hero Average Analysis System**: New analysis engine that compares player stats against hero averages from STRATZ data
- **Focus Areas**: Single highest priority issue to focus on for improvement
- **Numbers That Matter**: Role-specific KPIs showing player value vs hero average with percentage differences
- **Core Version Indicator**: Shows when analysis is based on limited hero average data
- **Updated Ruleset**: New ruleset.jsonc with minute-specific rules and hero average comparisons
- **Hero Average Rule Engine**: New service for evaluating rules against hero average data

### Changed
- **Analysis Logic**: Replaced percentile-based analysis with hero average comparisons
- **Report Structure**: Added focus area section and numbers that matter grid
- **Rule Evaluation**: Rules now compare player performance against hero-specific averages
- **Threshold System**: Updated to use percentage differences from hero averages

### Technical
- **New Service**: `HeroAverageRuleEngine` for hero average-based analysis
- **Updated Types**: Added `FocusArea`, `NumbersThatMatter`, and related interfaces
- **Ruleset Version**: Updated to 3.0.0 with new structure
- **Threshold Resolution**: Proper handling of threshold references in rules

## [2.0.0] - 2024-12-18

### Added
- **STRATZ Integration**: Direct integration with STRATZ GraphQL API for match data
- **Hero Average Data**: Access to hero-specific performance averages
- **Enhanced KPIs**: More detailed performance metrics including IMP (Impact)
- **Improved Rule Engine**: More sophisticated rule evaluation with role-specific logic

### Changed
- **Data Source**: Switched from OpenDota to STRATZ for richer match data
- **Analysis Depth**: Enhanced analysis using hero average comparisons
- **Performance Metrics**: Added STRATZ-specific metrics like IMP and hero averages

## [1.0.0] - 2024-12-17

### Added
- **Initial Release**: Basic replay analysis system
- **OpenDota Integration**: Match data fetching from OpenDota API
- **Role-based Analysis**: Position-specific advice and metrics
- **KPI Grid**: Performance metrics with percentile rankings
- **Timeline Markers**: Key timing events in the match
- **Share Links**: Copyable URLs for sharing reports
- **Local History**: Browser-based report history 