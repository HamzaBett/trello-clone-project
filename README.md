# Collaborative Project Management Tool

A production-ready Trello clone with real-time collaboration, drag-and-drop functionality, and modern UI.

## Features

- **Board Management**: Create, update, delete boards with custom backgrounds
- **List & Card Management**: Full CRUD operations with drag-and-drop reordering
- **Real-time Collaboration**: Live updates across all connected users via Socket.IO
- **User Authentication**: JWT-based auth with email/password login
- **Rich Card Details**: Due dates, labels, checklists, attachments, comments
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

**Frontend**: Next.js 14+, TypeScript, Tailwind CSS, React Beautiful DND, Shadcn/UI  
**Backend**: Node.js, Express, MongoDB, Socket.IO, JWT  
**DevOps**: Docker, Docker Compose

## Architecture

The application follows a clean architecture pattern with:
- Next.js App Router for server-side rendering
- Redux Toolkit for state management
- RESTful API with /api/v1 prefix
- Socket.IO for real-time features
- MongoDB with Mongoose ODM

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd trello-clone-project
   npm run setup
   ```
3. Set up environment variables (see .env.example)
4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup

```bash
docker-compose up --build
```


## Environment Variables

See [.env.example](./.env.example) for required environment variables.

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production assets
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Deployment

The application is ready for deployment to Vercel (frontend) and any Node.js hosting provider (backend).

## License

MIT
