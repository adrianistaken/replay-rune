# Changelog

## [Unreleased] - STRATZ API Integration

### Added
- **STRATZ GraphQL API Integration**: Complete refactor to use STRATZ API as the sole data source
- **New STRATZ Service**: `app/services/stratz.ts` - Handles all STRATZ GraphQL API interactions
- **STRATZ Rule Engine**: `app/services/stratzRuleEngine.ts` - Analyzes performance using STRATZ-specific metrics
- **Server-side API Proxy**: `server/api/stratz/graphql.post.ts` - Secure proxy to avoid exposing API tokens
- **New Type Definitions**: Added comprehensive STRATZ API type definitions in `app/types/index.ts`

### Changed
- **Data Source**: Replaced OpenDota API with STRATZ GraphQL API
- **Performance Analysis**: Updated to use STRATZ-specific metrics including IMP (Impact) scores
- **Rule Engine**: Simplified and optimized for STRATZ data structure
- **Report Generation**: Streamlined to work with pre-parsed STRATZ data
- **Nuxt Configuration**: Added runtime config for environment variables

### Removed
- **OpenDota Service**: Replaced with STRATZ service
- **Parsing Logic**: Removed replay parsing since STRATZ data is pre-parsed
- **Parsing Status Management**: No longer needed with STRATZ
- **Local JSON Dependencies**: Removed runtime loading of hero/item JSON files

### Technical Details
- **Environment Variables**: Requires `STRATZ_API_TOKEN` in `.env` file
- **API Endpoint**: Uses secure proxy at `/api/stratz/graphql`
- **Data Structure**: Leverages STRATZ's rich player and hero average data
- **Performance Metrics**: Focuses on GPM, XPM, IMP, kill participation, and role-specific metrics

### Migration Notes
- Users need to obtain a STRATZ API token from https://stratz.com/api
- Add `STRATZ_API_TOKEN=your_token_here` to `.env` file
- All existing functionality preserved with improved data quality
- No changes to UI/UX - same report flow maintained 