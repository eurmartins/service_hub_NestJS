# Service Hub with NestJS

This project is a service hub implementation using **NestJS**, with a focus on a clean, robust, and scalable architecture.

## 1. Clean Architecture

The project adopts the principles of **Clean Architecture** to ensure:

- **Separation of Concerns**: Each layer has a clear and well-defined purpose.
- **Testability**: The business logic is independent of external frameworks and technologies, facilitating unit testing.
- **Maintainability**: The modular structure allows the system to evolve in an organized manner.

The structure is divided into **three main layers**, with a **strict dependency rule**:
> Outer layers depend on inner layers, but never the other way around.

```
╔═════════════════════════════════════════════════════════════╗
║ INFRASTRUCTURE                                              ║
║ (Frameworks, DB, API, Web, etc.)                            ║
║ ╔═══════════════════════════════════════════════════════╗   ║
║ ║ APPLICATION                                           ║   ║
║ ║ (Use Cases, Services)                                 ║   ║
║ ║ ╔═════════════════════════════════════════════════╗   ║   ║
║ ║ ║ DOMAIN                                          ║   ║   ║
║ ║ ║ (Entities, Pure Rules)                          ║   ║   ║
║ ║ ╚═════════════════════════════════════════════════╝   ║   ║
║ ╚═══════════════════════════════════════════════════════╝   ║
╚═════════════════════════════════════════════════════════════╝
```

---

## 2. Bounded Contexts and Main Aggregates

The domain is divided into **Bounded Contexts** to isolate responsibilities. Each context has **one or more aggregates**.

| Context | Main Aggregate | Description |
|---|---|---|
| **Identity and Access** | `User` | Focused on authentication and access management. |
| **Customer Management** | `Client` | Models the consumer of the services. |
| **Service Catalog** | `Provider`, `OrderService` | Models the service provider and their catalog. |
| **Orders and Contracts** | `Order` | Models the transaction between a customer and a provider. |
| **Reviews** | `Rating` | Models the feedback for a completed service. |

---

## 3. Context Details

Below is a detailed description of each context, its aggregates, and business rules, based on the entity files.

### 3.1. Identity and Access Context
Exclusively focused on **who can access the system**.

#### `User` Aggregate
- **Fields**: `id` (UUID), `_email` (String), `_hashPassword` (String), `active` (Boolean).
- **Business Rules**:
    - The email must be **unique**.
    - The password must have a **minimum of 8 characters**, containing letters and numbers.
    - An **inactive** (`active: false`) user cannot authenticate.

### 3.2. Customer Management Context
Models the actor who **consumes** the services.

#### `Client` Aggregate
- **Fields**: `id` (UUID, same as `User.id`), `name` (String).
- **Business Rules**:
    - A **Client** is created only after the base **User** is registered.

### 3.3. Service Catalog Context
Models the actor who **offers** services and their catalog.

#### `Provider` Aggregate
- **Fields**: `id` (UUID, same as `User.id`), `name` (String), `professionalDescription` (String, Optional).

#### `OrderService` Entity
- **Fields**: `id` (UUID), `title` (String), `description` (String), `price` (Decimal), `status` (Enum: `ACTIVE`, `INACTIVE`), `providerId` (UUID).
- **Business Rules**:
    - A **Provider** is created only after the base **User** is registered.
    - The `price` of a service must be **greater than zero**.
    - A service can only be hired if it is **ACTIVE**.
    - A service **cannot be physically deleted** if it is linked to an order—it must be **inactivated**.

### 3.4. Orders and Contracts Context
Models the **transaction** between a Client and a Provider's Service.

#### `Order` Aggregate
- **Fields**: `id` (UUID), `clientId` (UUID), `serviceId` (UUID), `providerId` (UUID), `chargedValue` (Decimal), `status` (Enum: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`), `createdAt` (Timestamp), `completedAt` (Timestamp, Nullable).
- **Business Rules**:
    - `clientId` cannot be the same as `providerId`.
    - Status flow: `PENDING` → `IN_PROGRESS` → `COMPLETED`. `CANCELED` is a final state.
    - `chargedValue` is fixed at the time of order creation.
    - **PENDING** orders are automatically canceled after **48 hours**.
    - An order can only be canceled (by the Client or Provider) while it is in **PENDING** status.

### 3.5. Reviews Context
Models the **feedback for a completed service**.

#### `Rating` Aggregate
- **Fields**: `id` (UUID), `orderId` (UUID, unique), `clientId` (UUID), `providerId` (UUID), `rating` (Integer, 1–5), `comment` (String, Optional).
- **Business Rules**:
    - A review can only be submitted for **COMPLETED** orders.
    - Only the **Client of the order** can submit a review.
    - Each order can only be **reviewed once**.
    - The client has **30 days after order completion** to submit a review.

---

## How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/en/) (version 18 or higher)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A database environment (e.g., PostgreSQL, MySQL) and a configured `.env` file.

### 1. Clone the Repository

```bash
git clone https://github.com/eurmartins/service_hub_NestJS.git
cd service_hub_NestJS
```

### 2. Install Dependencies

```bash
npm install
```
or
```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root, based on the `.env.example` file (if it exists). Fill it with your database settings and other required keys.

```env
# .env example
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
JWT_SECRET="your-secret-key"
```

### 4. Run Migrations (if applicable)
If the project uses an ORM like Prisma or TypeORM, run the migrations to create the database tables.

```bash
# Example with Prisma
npx prisma migrate dev
```

### 5. Run the Project

#### Development Mode
To start the server in development mode with hot-reloading:

```bash
npm run start:dev
```

The server will be available at `http://localhost:3000`.

#### Production Mode
To build the project and start it in production mode:

```bash
# 1. Build the project
npm run build

# 2. Start the server
npm run start:prod
```

### 6. Run Tests

To execute the unit and integration tests:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Tests with code coverage
npm run test:cov
```