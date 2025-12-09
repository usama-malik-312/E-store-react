# Electric Store Management System - Frontend

A modern React.js frontend application for managing an electric store, built with Vite, TypeScript, and Tailwind CSS.

## Features

- ✅ Modern UI with Tailwind CSS and Ant Design
- ✅ JWT Authentication with protected routes
- ✅ Responsive layout with sidebar navigation
- ✅ Dark/Light mode support
- ✅ React Query for data fetching
- ✅ Form validation with React Hook Form + Zod
- ✅ Framer Motion animations
- ✅ i18next setup (ready for translations)
- ✅ Axios instance with interceptors

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Ant Design** - UI components
- **React Router** - Routing
- **React Query** - Data fetching
- **React Hook Form + Zod** - Form handling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **i18next** - Internationalization

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  api/          # API service functions
  assets/       # Static assets
  components/   # Reusable components
  features/     # Feature modules
    auth/       # Authentication features
    dashboard/  # Dashboard features
  hooks/        # Custom React hooks
  layouts/      # Layout components
  lib/          # Library configurations
  pages/        # Page components
  router/       # Route configuration
  store/        # State management (future)
  types/        # TypeScript types
  utils/        # Utility functions
```

## Authentication

The app uses JWT tokens stored in localStorage. Protected routes automatically redirect to `/login` if no valid token is present.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000/api)

## Next Steps

- Implement Inventory Management module
- Implement POS (Point of Sale) module
- Implement User Management module
- Add more dashboard widgets
- Implement i18n translations
- Add more authentication features (password reset, etc.)

