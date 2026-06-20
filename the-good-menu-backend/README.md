# The Good Menu - Backend

This directory contains the NestJS REST API for The Good Menu application. It handles all database interactions, user authentication, and core business logic.

## Tech Stack

- Framework: NestJS (v11)
- Language: TypeScript
- Database ORM: TypeORM (v0.3)
- Database Engine: MySQL
- Authentication: Passport.js with JWT
- Security: bcrypt for password hashing
- Mail: Nodemailer for automated alerts

## Environment Variables

Create a `.env` file in the root of the `the-good-menu-backend` directory with the following required variables:

```env
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# Email Configuration (Nodemailer / Ethereal Email)
TL_EMAIL=recipient@example.com
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_username
SMTP_PASS=your_ethereal_password
```

## Installation and Startup

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

## Key Architecture Notes

- Tenant Isolation: The application enforces strict data scoping. Endpoints for `Meals` and `Schedules` extract the `userId` from the JWT payload to isolate data per user. System-wide presets are accessible where `userId` is null.
- Audit Logging: Database auditing is handled automatically via a TypeORM `EventSubscriber` (The Watchtower). It intercepts insert, update, and delete mutations to generate immutable audit logs and triggers email alerts via Nodemailer.
