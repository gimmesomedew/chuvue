# PawFinder - Dog Services Directory

A modern web application to help dog owners find local services for their pets, including dog parks, veterinarians, groomers, and daycare services.

## Features

- Clean, modern UI with responsive design
- Search functionality for finding dog services
- Category-based browsing
- Location-based service discovery
- Built with Next.js 14+, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui component library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
app/
├── globals.css       # Global styles and Tailwind directives
├── layout.tsx        # Root layout component
├── page.tsx          # Home page component
└── favicon.ico       # Site favicon
components/
├── ui/               # shadcn/ui components
└── Header.tsx        # Site header component
lib/
└── utils.ts          # Utility functions
```

## Future Enhancements

- User authentication
- Service provider profiles
- Reviews and ratings
- Appointment booking
- Favorites and saved locations
- Mobile app version

## License

MIT
