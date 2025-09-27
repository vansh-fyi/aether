# Aether - Design System Generator

Aether is a React-based design system generator that uses AI to create complete design systems with customizable tokens, components, and export capabilities.

## Features

- 🎨 **AI-Powered Design Generation**: Upload images or choose personas to generate custom design systems
- 🔧 **Live Preview & Customization**: Real-time preview with toggleable controls for colors, typography, and components
- 📦 **Export Functionality**: Download complete design systems as TypeScript/TSX files in a zip archive
- 🎭 **Multiple Generation Methods**:
  - Upload your vision (image analysis)
  - Choose from pre-built personas
  - "Chaos" mode for AI-generated randomness
- 🌙 **Theme Support**: Light/dark mode preview
- 📱 **Responsive Design**: Desktop and mobile viewport modes

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aether
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Gemini AI API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini AI API key
4. Deploy!

Vercel will automatically use the `vercel.json` configuration and run the build process.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The `dist/` directory contains the built application ready for deployment.

## Environment Variables

- `VITE_GEMINI_API_KEY`: Google Gemini AI API key (required for AI features)
- `VITE_APP_NAME`: Application name (optional)
- `VITE_APP_VERSION`: Application version (optional)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **AI Integration**: Google Gemini API
- **Export**: JSZip for file generation

## Project Structure

```
.
├── components/           # React components
│   ├── features/         # Feature-specific components
│   ├── icons/           # Icon components
│   └── ui/              # Reusable UI components
├── engine/              # Design system generation engine
├── services/            # API services (Gemini client)
├── store/               # Zustand state management
├── styles/              # Global styles and CSS
├── utils/               # Utility functions
└── src/                 # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

See LICENSE file for details.
Design System generator for vibe coding tools
Updated project dependencies.
Triggering final build.
