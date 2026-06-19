# The Good Menu: Backend

A NestJS REST API built for "The Good Menu: An Aboitiz Meal Planner." Developed as an onboarding project, this backend provides a secure, typed, and modular foundation for managing users, Aboitiz retail products, meals, and weekly schedules. It features JWT authentication, automated database auditing, and comprehensive relational data management.

---

### Tech Stack

* **Framework:** NestJS 11
* **Language:** TypeScript
* **Database:** MySQL
* **ORM:** TypeORM 0.3
* **Authentication:** Passport-JWT, Bcrypt
* **Mailing:** Nodemailer (via SMTP)

---

### Prerequisites

Ensure you have the following installed on your local machine:
* Node.js (v18 or higher)
* MySQL Server
* Git

---

### Installation

1. Navigate to the backend directory:
   ```bash
   cd the-good-menu-backend
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory and configure the following keys:
   ```env
   PORT=3000
   TL_EMAIL=your_email@example.com
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your_ethereal_username
   SMTP_PASS=your_ethereal_password
   JWT_SECRET=your_secret_key
   JWT_EXPIRATION=1d
   ```

4. Database Setup:
   Ensure your local MySQL server is running and database `the_good_menu` is created. By default, connection settings in `src/app.module.ts` are configured for:
   * **Host:** `127.0.0.1`
   * **Port:** `3306`
   * **Username:** `root`
   * **Password:** `password`
   * **Database:** `the_good_menu`

---

### Running the Application

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Once the server is running, you can populate the database with mock Aboitiz products and preset meals by triggering the seeder endpoint:
   * **Method:** `POST`
   * **Endpoint:** `http://localhost:3000/seed/all`

---

### Key Architecture & Features

* **Strict Validation:** All incoming requests are validated using `class-validator` and `class-transformer` via a global `ValidationPipe`. Non-whitelisted properties are strictly forbidden.
* **JWT Security:** Passwords are automatically hashed via `bcrypt` using TypeORM lifecycle hooks before insertion or updates. Protected routes require a valid Bearer token provided by the `JwtAuthGuard`.
* **Database Auditing (The Watchtower):** A global TypeORM `EventSubscriber` intercepts all database mutations (`INSERT`, `UPDATE`, `DELETE`, `SOFT_DELETE`). It logs changes to the `audit_logs` table and triggers automated email alerts via Nodemailer.
* **Conditional Data Deletion:**
  * **Products:** Soft-deleted to preserve historical audit logs and meal data.
  * **Meals:** Soft-deleted if actively linked to a user's schedule; hard-deleted if unlinked.
  * **Users:** Hard-deleted with cascading effects on their schedules and meals.
* **Service-Layer Execution:** All database logic is decoupled from controllers, utilizing a strict "Fetch-then-Save" pattern to ensure TypeORM lifecycle hooks are properly triggered.

---

### API Structure

#### Authentication & Users (`/auth` & `/users`)
* `POST /register` - Register a new user
* `POST /login` - Authenticate and receive a JWT
* `GET /users` - List all users
* `GET /users/:id` - Get specific user
* `PATCH /users/:id` - Update user details
* `DELETE /users/:id` - Hard delete user (cascading delete)

#### Products (`/products`)
* `POST /products` - Add new product
* `GET /products` - List all products
* `GET /products/:id` - Get specific product
* `PATCH /products/:id` - Update product details
* `DELETE /products/:id` - Soft delete product

#### Meals (`/meals`)
* `POST /meals` - Create a meal with nested ingredients
* `GET /meals` - List all meals
* `GET /meals/:id` - Get specific meal
* `PATCH /meals/:id` - Update meal details
* `DELETE /meals/:id` - Conditional soft/hard delete

#### Schedules (`/schedules`)
* `POST /schedules` - Schedule a meal
* `GET /schedules` - List schedules
* `GET /schedules/:id` - Get specific schedule
* `PATCH /schedules/:id` - Update schedule details
* `DELETE /schedules/:id` - Hard delete schedule

#### Audit Logs (`/audit-logs`)
* `GET /audit-logs` - List all database mutation logs
* `GET /audit-logs/:id` - Get specific log details
