# The Good Menu - Frontend

This directory contains the React single-page application (SPA) for The Good Menu. It provides the user interface for managing meal plans, ingredients, and schedules.

## Tech Stack

- Core: React 18
- Build Tool: Vite
- Language: TypeScript
- Styling: Tailwind CSS 
- State Management: @tanstack/react-query
- Routing: React Router DOM
- Iconography: Lucide React

## Environment Variables

Create a `.env.local` file in the root of the `the-good-menu-frontend` directory with the following variable to point to your backend API:

```env
VITE_API_URL=http://localhost:3000
```

## Installation and Startup

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Key Architecture Notes

- Cumulative Layout Shift (CLS) Prevention: The application utilizes custom `SkeletonTable` loading components. These components reserve the necessary vertical DOM space while data is being fetched by React Query, preventing jarring layout jumps and improving the overall user experience.
- Data Filtering and Sorting: Server-side state is strictly managed by React Query, while local UI interactions (like text searches, category filters, and sorting) are managed via local React state. This Container/Presenter pattern ensures fast, responsive data manipulation on the client side without unnecessary API calls.
