# AI App

A Next.js application with Prisma ORM and SQLite database.

## Database Schema

### User Model
- `id`: Primary key (auto-increment)
- `email`: Unique email address
- `password`: User password

### Data Model
- `id`: Primary key (auto-increment)
- `entity`: Entity type/name
- `content`: JSON string content
- `userId`: Foreign key reference to User

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Push database schema:
   ```bash
   npx prisma db push
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## Database Management

Use Prisma Studio to view and manage your data:
```bash
npm run db:studio
```
