# EZRA - Educational Research Platform

**EZRA** is a public-facing research showcase and internal management platform for Pfluger Architects' Research & Benchmarking department. The platform displays research projects on an interactive map, provides a gallery of completed work, and enables collaboration inquiries.

## Overview

EZRA serves two audiences:
- **Public Mode**: Showcase research portfolio to school districts, partners, and the public
- **Internal Mode**: Research management tools for Pfluger team members (login required)

## Technology Stack

- **React 18** with TypeScript
- **Vite** - Build tooling
- **Tailwind CSS v3** - Styling with Pfluger brand colors
- **Mapbox GL JS** - 3D interactive mapping with perspective view
- **Recharts** - Data visualizations
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible components
- **PapaParse** - CSV data parsing

## Features

### Public Features (Always Accessible)
- **Research Campus** - Interactive map showing all research projects with custom category icons
- **Gallery** - Portfolio showcase of completed research projects
- **Collaborate** - Contact form for partnership inquiries with confidential inquiry option

### Internal Features (Login Required)
- **Research Hub** - Dashboard with metrics and analytics
- **Submit Pitch** - Internal research proposal submission
- **Analytics** - Detailed insights and KPIs

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Build for Production

```bash
npm run build
```

## Authentication

For internal team members:
- Click "Team Sign In" at the bottom of the sidebar
- Email: `apps@pflugerarchitects.com`
- Password: `123456`

*Note: This is currently hardcoded for development. Production will use proper authentication.*

## Project Structure

```
src/
├── components/
│   ├── System/
│   │   ├── ThemeManager.tsx      # Pfluger brand colors & theme
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── LoginModal.tsx        # Login UI
│   └── ui/                       # Radix UI components
├── views/
│   ├── ResearchMap.tsx           # Main map view
│   ├── Portfolio.tsx             # Gallery of completed research
│   ├── Collaborate.tsx           # Contact/partnership page
│   ├── Dashboard.tsx             # Internal hub (auth required)
│   ├── PitchSubmission.tsx       # Internal pitch form
│   └── Analytics.tsx             # Internal metrics
├── data/
│   └── loadProjects.ts           # CSV data loader
├── context/
│   └── ProjectsContext.tsx       # Global project state
public/
└── data/
    └── research_projects.csv     # Research project data
```

## Data Management

Research projects are currently stored in `/public/data/research_projects.csv` with the following structure:

- `id` - Project identifier (e.g., X25-RB01)
- `title` - Project name
- `researcher` - Lead researchers (pipe-separated)
- `category` - Research category (psychology, sustainability, etc.)
- `phase` - Current phase (Pre-Research, Developmental, Completed)
- `description` - Project summary
- `latitude` / `longitude` - Map coordinates
- `partners` - Collaborating organizations (pipe-separated)
- `startDate` / `completionDate` - Project timeline

## Theme & Branding

EZRA uses Pfluger Architects' official brand colors managed through `ThemeManager.tsx`:

**Primary Colors:**
- Brick Red: `#9A3324`
- Sky Blue: `#00A9E0` (primary accent)
- Olive Green: `#67823A`
- Chartreuse: `#B5BD00`
- Orange: `#F2A900`
- Salmon: `#f16555`

**Dark Theme:**
- Background: `#121212` (Material Design recommended)
- Cards: `#1e1e1e`
- Borders: `#2a2a2a`

## Research Categories

Each research category has a dedicated color and icon:
- **Psychology** - Brick Red, Brain icon
- **Health & Safety** - Salmon, Heart icon
- **Sustainability** - Olive Green, Sprout icon
- **Immersive Learning** - Sky Blue, Monitor icon
- **Campus Life** - Chartreuse, Home icon
- **Fine Arts** - Orange, Palette icon

## Contributing

This is an internal Pfluger Architects project. For questions or contributions, contact the Research & Benchmarking team.

## License

Proprietary - Pfluger Architects
