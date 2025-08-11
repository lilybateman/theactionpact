# The Action Pact

A bilingual (English/French) newsletter signup website for The Action Pact.

## Features

- **Bilingual Support**: English and French language toggle
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Form Validation**: Email validation and city autocomplete
- **Modern UI**: Clean, professional design with custom styling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd theactionpact
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Development

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite

## Building for Production

```bash
npm run build
# or
bun run build
```

## Deployment

The built files in the `dist` directory can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── integrations/  # External service integrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your chosen license]
