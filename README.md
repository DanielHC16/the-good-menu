# The Good Menu

The Good Menu is a full-stack web application designed to serve as a comprehensive meal planner utilizing products from Aboitiz Foods' retail brand, The Good Meat.

## Monorepo Structure

This project is structured as a monorepo, containing both the backend API and the frontend client within a single repository.

- `/the-good-menu-backend`: The NestJS REST API responsible for data management, authentication, and business logic.
- `/the-good-menu-frontend`: The React single-page application providing the user interface.
- `/context`: Contains architectural documentation, Entity-Relationship Diagrams (ERD), and project context files.

## Prerequisites

Before running the application, ensure the following are installed on your system:

- Node.js (v18 or higher recommended)
- MySQL Server (v8 or higher)

## Running the Application

To start the full application, you need to run both the backend and frontend servers concurrently in separate terminal instances.

### Starting the Backend

1. Navigate to the backend directory:
   ```bash
   cd the-good-menu-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```

### Starting the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd the-good-menu-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

For detailed technical documentation, please refer to the README files located within the respective backend and frontend directories.
