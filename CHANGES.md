### Fixed
- **Typography Balance**: Reduced oversized header text across all pages for better visual hierarchy
  - **Main Page Headers**: Reduced from `text-4xl lg:text-5xl` to `text-3xl lg:text-4xl`
  - **Section Headers**: Reduced from `text-3xl` to `text-2xl lg:text-3xl`
  - **Improved Readability**: Better text size balance across home, analysis, history, subscribe, and report pages
  - **Visual Consistency**: More harmonious typography scale throughout the application

## [4.4.0] - 2024-12-19

### Added
- **New Hero Layout Design**: Completely redesigned hero selection interface for better visual representation
  - **Horizontal 5v5 Layout**: Heroes now display in a horizontal line-up format similar to Dota 2 scoreboards
  - **Position-Based Sorting**: Heroes are automatically sorted by position (1-5) when available from STRATZ data
  - **Team Separation**: Clear visual separation between Radiant (top) and Dire (bottom) teams
  - **VS Separator**: Added prominent "VS" text between teams for better match visualization
  - **Position Display**: Shows position number under each hero name for clarity

### Changed
- **Hero Display Format**: Replaced vertical grid layout with horizontal card-based design
  - **Card Layout**: Each hero now displays as a vertical card with image, name, and position
  - **Larger Hero Images**: Increased hero image size from 48x48 to 64x64 pixels for better visibility
  - **Centered Alignment**: Hero names and positions are now center-aligned for cleaner appearance
  - **Responsive Design**: Layout automatically adapts to mobile screens with proper stacking
  - **Consistent Card Widths**: All hero cards now have uniform width (w-20 on mobile, w-24 on desktop)
  - **Compact VS Separator**: Reduced VS text size from text-2xl to text-lg for better proportion
  - **Optimized Spacing**: Reduced gaps between cards and teams for tighter, more professional layout

### Technical
- **Hero Interface Update**: Added `position` field to Hero interface for position-based sorting
- **Position Data Integration**: Enhanced hero extraction to capture position data from STRATZ API
- **Computed Properties**: Updated radiantHeroes and direHeroes to sort by position when available
- **Fallback Handling**: Graceful fallback to original order when position data is unavailable
- **Mobile Responsiveness**: Implemented flexbox-based responsive design that stacks vertically on small screens
- **Fixed Width Cards**: Used Tailwind width classes (w-20, w-24) for consistent card sizing
- **Text Truncation**: Added truncate class to hero names to prevent overflow in fixed-width cards

### Responsive Design
- **Desktop Layout**: Heroes display horizontally in a row with consistent spacing and uniform card widths
- **Mobile Layout**: On small screens, heroes stack vertically while maintaining team grouping and card consistency
- **Flexible Wrapping**: Uses flexbox without flex-wrap to ensure horizontal alignment on larger screens
- **Consistent Spacing**: Maintains proper gaps (gap-3 on mobile, gap-4 on desktop) across all device sizes

## [4.3.0] - 2024-12-19

### Added
- **Report Page Styling**: Completely restyled individual analysis report page to match other pages
  - **Consistent Header**: Added same navigation header with mobile menu support
  - **Background Integration**: Applied Dota 2 background image and overlay system
  - **Gradient Styling**: Used same gradient backgrounds and box-shadows for all elements
  - **Color System Fix**: Replaced all old color classes with new CSS variable system
  - **Enhanced Layout**: Improved loading states, error states, and report content sections
  - **Mobile Responsiveness**: Added mobile menu and responsive design elements
  - **Complete Design Unity**: All five main pages now share identical design language

### Changed
- **Visual Consistency**: All pages now share the same beautiful, cohesive design language
- **Color System**: Unified color usage across all components and pages
- **Component Styling**: Consistent gradient backgrounds and shadows throughout
- **Typography**: Improved text hierarchy and readability across all pages

### Technical
- **Report Page Overhaul**: Complete template restructure with new styling system
- **Mobile Menu Integration**: Added consistent mobile navigation to report page
- **Loading States**: Enhanced loading and error states with new design system
- **Performance Metrics**: Improved KPI display with better visual hierarchy
- **Hero Display**: Enhanced hero information display with larger images and better layout

# Changelog

## [4.2.1] - 2024-12-19

### Fixed
- **Hero Images in Reports**: Fixed critical issue where hero images were not displaying in match reports
  - **Race Condition**: Resolved timing issue where HeroImage components rendered before hero data was loaded
  - **Missing Hero Data Loading**: Report page now properly loads hero data on mount before rendering
  - **Component Loading States**: Added skeleton loading animation while hero data is being fetched
  - **Fallback Handling**: Improved error handling and fallback to default hero images when needed
  - **Navigation Issues**: Fixed hero image display when navigating from history page to report page

### Technical
- **Report Page Enhancement**: Added `useHeroes()` call in report page `onMounted` hook
- **HeroImage Component**: Enhanced with loading states and better error handling
- **Data Loading Order**: Ensured hero data is loaded before any image components render
- **Loading UX**: Added skeleton loading animation for better user experience during data fetch

### Cleanup
- **Ruleset File Consolidation**: Removed duplicate `ruleset.v3.jsonc` from root directory
  - **Single Source of Truth**: Now only using the version in `public/` folder that's actually loaded by the application
  - **Eliminated Confusion**: Removed potential for confusion between two identical files
  - **Cleaner Project Structure**: Simplified project organization by removing unused duplicate

## [4.2.0] - 2024-12-19

### Added
- **Match Parsing Status Checking**: New feature to handle unparsed matches gracefully
  - **Unparsed Match Detection**: Automatically detects when a match hasn't been parsed by Stratz yet
  - **User-Friendly Warnings**: Shows clear warning message when match needs parsing with helpful instructions
  - **Stratz Integration**: Direct link to Stratz match page for manual parsing
  - **Background Polling**: Automatically checks parsing status every 30 seconds with user feedback
  - **Rotating Messages**: Provides rotating status messages during polling to keep users informed
  - **Automatic Hero Loading**: Once match is parsed, automatically loads hero data and enables analysis

### Changed
- **Analyze Button Behavior**: Button now shows "Parse Match First, Then Analyze" for unparsed matches
- **Match Loading Flow**: Users must wait for parsing to complete before proceeding to analysis
- **User Experience**: Clear guidance on what to do when matches aren't parsed yet

### Technical
- **Polling System**: Implemented 30-second interval polling for match parsing status
- **Status Management**: Added `isMatchParsed` computed property and polling state management
- **Error Handling**: Graceful handling of parsing status checks with user feedback
- **Memory Management**: Proper cleanup of polling intervals on component unmount

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

## [Unreleased]

### Added
- **Complete Home Page Redesign**: Major visual overhaul to match modern design aesthetic
  - **New Design System**: Implemented CSS custom properties with cyan/blue primary colors (#0df2f2)
  - **Modern Header**: Added sticky header with navigation, logo, and registration buttons
  - **Hero Section**: Large hero area with compelling headline and call-to-action button
  - **Feature Cards**: Three-column feature showcase with icons and descriptions
  - **Enhanced Match Analysis**: Redesigned analysis section with better visual hierarchy
  - **Registration CTA**: Added prominent registration call-to-action section
  - **Material Icons**: Integrated Material Symbols for enhanced visual elements
  - **Space Grotesk Font**: Updated typography to modern, professional font family
  - **Rune Pattern Background**: Subtle background pattern for visual interest
  - **Glowing Button Effects**: Enhanced button interactions with glow effects and animations
  - **Responsive Design**: Improved mobile and desktop layouts with better spacing
  - **Smooth Scrolling**: Added smooth scroll functionality to analysis section
  - **Enhanced Visual Feedback**: Better hover states, transitions, and animations throughout
- **Dota 2 Background Image**: Added authentic Dota 2 background from Steam CDN
  - **Background Integration**: Seamlessly integrated with existing design system
  - **Readability Enhancement**: Added dark overlay to ensure text remains readable
  - **Responsive Design**: Background scales properly on all device sizes
  - **Performance Optimized**: Uses Steam's CDN for fast loading and reliability
- **Glass-Morphism Component Styling**: Enhanced all major components with sophisticated gradient backgrounds
  - **Gradient Backgrounds**: Applied linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%) to all cards
  - **Enhanced Shadows**: Added 0px 0px 50px #000 box-shadow for depth and drama
  - **Component Coverage**: Applied to Key Features, Match Analysis, Recent Reports, Registration CTA, and Mobile Menu
  - **Visual Consistency**: All components now have unified, premium appearance
  - **Modern Aesthetics**: Glass-morphism effect creates sophisticated, gaming-focused design
- **Accent Color Update**: Changed primary accent color from gold to warm orange (#cf5a2c)
  - **Color Consistency**: Updated CSS variables in both app.vue and main.css
  - **Header Branding**: "Replay Rune" text now uses the new accent color
  - **Interactive Elements**: All buttons and accents now use the warm orange color
  - **Visual Harmony**: New color creates better contrast and modern gaming aesthetic
- **Header Navigation Improvements**: Enhanced header functionality and styling
  - **Clickable Logo**: Logo and "Replay Rune" text now link to home page
  - **Hover Effects**: Added opacity transition on logo hover for better UX
  - **Brand Color**: Header text uses the new accent color for brand consistency
- **Overlay Positioning Fix**: Corrected background overlay positioning and opacity
  - **Full Width Coverage**: Changed from absolute to fixed positioning for edge-to-edge coverage
  - **Opacity Adjustment**: Reduced overlay opacity from 40% to 30% for better readability
  - **Z-index Management**: Proper layering ensures overlay works correctly across all screen sizes
- **Component Background Consistency**: Applied gradient backgrounds to all interactive elements
  - **Input Fields**: Match ID input now uses the same gradient background as other components
  - **Hero Selection**: All hero selection buttons use consistent gradient styling
  - **Role Selection**: Role buttons now match the overall design aesthetic
  - **Visual Unity**: All form elements and interactive components now have cohesive appearance
  - **Gradient Standardization**: Consistent use of linear-gradient(300deg, rgba(0, 0, 0, 0.38) 3.07%, rgba(6, 37, 65, 0.3) 88.06%) across all components
- **Analysis Page Separation**: Moved match analysis functionality to dedicated page
  - **New Analysis Page**: Created `/analysis` route with complete match analysis functionality
  - **Home Page Cleanup**: Removed analysis section from home page, replaced with CTA
  - **Navigation Update**: Added "Analysis" link to navigation, removed "Home" link
  - **Code Organization**: Separated concerns for better maintainability and user experience
  - **Streamlined Home**: Home page now focuses on features, recent reports, and analysis CTA
- **Border and Outline Cleanup**: Removed unwanted white/blue outlines and borders
  - **Default Browser Styles**: Eliminated browser default focus outlines and borders
  - **Global Style Reset**: Added CSS reset to remove all default borders and outlines
  - **Cleaner Appearance**: All elements now have clean, borderless appearance by default
  - **Custom Border Control**: Only intentional borders (using our design system) are now visible
  - **Component Border Removal**: Removed borders from key features, CTA sections, recent reports, and analysis elements
  - **Header Border Removal**: Cleaned up header borders for a more seamless appearance
  - **Form Element Borders**: Removed borders from input fields, buttons, and selection elements
  - **Status Message Borders**: Cleaned up borders from error, success, and warning messages
- **History Page Styling**: Completely restyled history page to match home and analysis pages
  - **Consistent Header**: Added same navigation header with mobile menu support
  - **Background Integration**: Applied Dota 2 background image and overlay system
  - **Gradient Styling**: Used same gradient backgrounds and box-shadows for all elements
  - **Enhanced Layout**: Improved report cards with better spacing, typography, and visual hierarchy
  - **Mobile Responsiveness**: Added mobile menu and responsive design elements
  - **Visual Consistency**: All pages now share the same beautiful, cohesive design language
- **Subscribe Page Styling**: Completely restyled subscribe page to match other pages
  - **Consistent Header**: Added same navigation header with mobile menu support
  - **Background Integration**: Applied Dota 2 background image and overlay system
  - **Gradient Styling**: Used same gradient backgrounds and box-shadows for all elements
  - **Color System Fix**: Replaced all old color classes with new CSS variable system
  - **Enhanced Layout**: Improved pricing cards, feature comparison, and FAQ sections
  - **Mobile Responsiveness**: Added mobile menu and responsive design elements
  - **Complete Design Unity**: All four main pages now share identical design language

### Changed
- **Visual Theme**: Completely updated color scheme from dark blue to modern cyan/blue palette
- **Layout Structure**: Reorganized content into logical sections with better visual flow
- **Component Styling**: Updated all form elements, buttons, and cards to match new design
- **Typography**: Changed from Inter to Space Grotesk for more modern appearance
- **Color Variables**: Replaced Tailwind custom colors with CSS custom properties for consistency
- **Navigation System**: Replaced old app-level navigation with page-specific modern navigation
  - **Removed Old Header**: Eliminated the old navigation bar from app.vue
  - **New Page Navigation**: Added modern header with logo, navigation links, and mobile menu
  - **Navigation Links**: Updated to include Home, History, and Subscribe pages
  - **Mobile Responsiveness**: Added mobile menu with hamburger button and overlay

### Technical
- **CSS Custom Properties**: Implemented comprehensive CSS variable system for consistent theming
- **Component Integration**: Maintained all existing Vue.js functionality while updating visual design
- **Font Integration**: Added Google Fonts for Material Symbols and Space Grotesk
- **Animation System**: Enhanced transitions and hover effects for better user experience

- **End-of-Game Rules Support**: Implemented support for rules that evaluate at the end of the game instead of at specific time intervals
  - Added `endOfGame` property to V3Rule interface
  - Updated ruleset.v3.jsonc to include end-of-game rules
  - Modified rule engine to handle end-of-game rule evaluation
  - Added `p5_couriers_end_game_win` rule as an example of end-of-game rule

- **Enhanced Rule Structure**: Improved rule messaging with separate header and description fields
  - Added `header` property for concise rule titles
  - Added `description` property for detailed explanations
  - Integrated data comparison showing actual values vs. hero averages
  - Maintained backward compatibility with existing rule logic

- **Modern UI Design**: Completely redesigned fix and win points with sleek, modern styling
  - **Enhanced Visual Hierarchy**: Larger, bolder headings with icons for better section identification
  - **Clean Card Design**: Simple, clean backgrounds with subtle borders and hover effects
  - **Icon Integration**: Added green checkmark icons for wins and numbered indicators for fixes
  - **Improved Typography**: Better font weights, sizes, and spacing for readability
  - **Proper Text Separation**: Description and data comparison text are clearly separated on different lines

### Changed
- **Ruleset Structure**: Updated ruleset.v3.jsonc to support both time-based and end-of-game rules
  - Rules with `endOfGame: true` check against final heroAverage values (last object in the list)
  - Rules with `atMin` property continue to work as before for time-based evaluation
  - Modified `p5_couriers_at_20_win` to `p5_couriers_end_game_win` to demonstrate end-of-game functionality
  - Added several new end-of-game rules for different positions and metrics

- **Rule Engine Enhancement**: Streamlined the rule engine with improved messaging
  - Replaced `text` property with `header` and `description` properties
  - Added `generateDataComparison()` method for showing actual values used in rule evaluation
  - Both title and description now use the new structure from the ruleset
  - Data comparison shows: "Your [Metric]: [Value], Hero Average: [Value], [X]% above/below average"

- **UI Layout Improvements**: Redesigned the presentation of fix and win points
  - **Separated Content**: Description and data comparison now display on separate lines
  - **Data Context**: Data comparison appears as subtle, technical sub-text for context
  - **Better Spacing**: Increased padding, margins, and gaps for improved visual breathing room
  - **Enhanced Shadows**: Added depth with improved shadow effects and hover states
  - **Rounded Corners**: Updated to use rounded-xl for a more modern appearance

### Technical Details
- **Rule Engine Updates**: 
  - Added `evaluateEndOfGameRule()` method for end-of-game rule evaluation
  - Added `getEndOfGamePlayerValue()` and `getEndOfGameHeroAverageValue()` methods
  - Added `generateDataComparison()` and `generateEndOfGameDataComparison()` methods
  - End-of-game rules use final match values instead of time-scaled estimates
  - Enhanced rule output with structured header, description, and data comparison

- **Data Handling**:
  - End-of-game rules access the last (highest time) entry in the heroAverage array
  - Player values are taken from final match statistics rather than minute-by-minute data
  - Courier kills and other end-of-match metrics now properly evaluate against final game state
  - Data comparison shows actual values used in rule evaluation for transparency
  - **Enhanced GraphQL Query**: Added new player fields for better data analysis
    - `position`: Player's position in the match
    - `partyId`: Party/team identifier
    - `towerDamage`: Total tower damage dealt
    - `heroDamage`: Total hero damage dealt
    - `playerSlot`: Player slot number for match identification

- **Centralized Rule Category System**: Created a comprehensive category management system
  - **Category Constants**: Centralized definition of all available rule categories
  - **Type Safety**: TypeScript interfaces ensure only valid categories are used
  - **Category Metadata**: Each category includes description, priority, and color information
  - **Future-Ready**: System designed for filtering, grouping, and organizing rules
  - **Consistent Naming**: All rules now use standardized category names (e.g., "LANING", "FIGHTING")

- **UI Enhancements**:
  - **CSS Classes**: Added custom CSS classes for enhanced card styling, gradients, and transitions
  - **Hover Effects**: Implemented smooth hover animations with scale and shadow effects
  - **Data Comparison Styling**: Created dedicated styling for data comparison text with monospace font and subtle backgrounds
  - **Icon Containers**: Added hover effects for icon containers with scale animations
  - **Responsive Design**: Improved spacing and layout for different screen sizes

- **Maintenance Benefits**:
  - All rule text is now centralized in the ruleset file with clear structure
  - Easy to add new rules with custom headers and descriptions
  - Data comparison automatically shows relevant metrics and values
  - Consistent messaging format across the application
  - Modern, maintainable CSS architecture with reusable classes 