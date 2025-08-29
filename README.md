# Replay Rune

A Dota 2 replay analysis tool that provides actionable feedback for improvement. Paste a match ID, pick your role, and get a clean one-page report with the top 3 fixes for your next game.

## Features

- **Quick Analysis**: Input match ID and role to get instant feedback
- **Role-Specific Advice**: Tailored recommendations for pos1-pos5
- **Actionable Fixes**: Top 3 specific improvements for your next game
- **Performance Metrics**: KPI grid with percentiles vs hero medians
- **Key Timings**: Timeline showing important game milestones
- **History**: Track your last 5 analyses locally
- **Shareable Links**: Copy and share your analysis with others

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Nuxt.js
- **Styling**: Tailwind CSS
- **Data**: OpenDota API (planned)
- **Storage**: Local browser storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd replay-rune
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Enter Match ID**: Paste a Dota 2 match ID from your recent games
2. **Select Role**: Choose your position (pos1-pos5)
3. **Get Analysis**: Review your personalized report with fixes and wins
4. **Track Progress**: View your analysis history and improvements over time

## Project Structure

```
replay-rune/
├── app/
│   ├── pages/
│   │   ├── index.vue          # Home page with input form
│   │   ├── history.vue        # Analysis history
│   │   └── report/
│   │       └── [matchId]/
│   │           └── [role].vue # Dynamic report page
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── app.vue                # Main app layout
├── public/                    # Static assets
└── nuxt.config.ts            # Nuxt configuration
```

## Development Status

### ✅ Completed
- Basic UI structure and navigation
- Input form with role selection
- Report page layout with all sections
- History management with localStorage
- Responsive design
- TypeScript interfaces

### 🚧 In Progress
- OpenDota API integration
- Rules engine for generating fixes
- Hero medians data for percentiles
- Real KPI calculations

### 📋 Planned
- CORS proxy for API calls
- Hero-specific advice
- Advanced analytics
- Export functionality

## Contributing

This is an MVP project. Contributions are welcome! Please check the [CHANGES.md](CHANGES.md) file for recent updates.

## License

MIT License - see LICENSE file for details.
