# EcoVision Express API Service

Production-ready backend API service for EcoVision built with Node.js, Express.js, TypeScript, Drizzle ORM, Better Auth, and Supabase Storage.

## Features

- **Authentication**: Official Better Auth integration with Google OAuth and session management.
- **ORM & Migrations**: Drizzle ORM with PostgreSQL.
- **Storage Abstraction**: `FileStorageService` with `SupabaseStorageService` and local fallback `LocalFileStorageService`.
- **Upload Pipeline**: Multer middleware enforcing 10MB limit and MIME type validation.
- **AI Integration**: Microservice client communicating with the FastAPI AI service.
- **Security**: Helmet headers, CORS restrictions, rate limiting, and centralized error handling.

## Endpoints

### Authentication
- `ALL /api/auth/*` - Better Auth session endpoints

### Analyses
- `POST /api/analyses` - Upload & analyze waste image (multipart/form-data with `image`)
- `GET /api/analyses` - List user's analyses (supports `search`, `filter`, `sort`, `limit`, `offset`)
- `GET /api/analyses/:id` - Get analysis details with detections & bounding boxes
- `DELETE /api/analyses/:id` - Delete an analysis and associated storage files

### Dashboard
- `GET /api/dashboard/stats` - Aggregate statistics (total analyses, e-waste count, percentage, top categories)

## Development Commands

```bash
pnpm dev         # Run dev server with tsx watch
pnpm build       # Compile TypeScript to dist/
pnpm start       # Start compiled server
pnpm typecheck   # Typecheck TypeScript without emit
pnpm test        # Run Vitest test suite
pnpm db:generate # Generate Drizzle SQL migrations
pnpm db:migrate  # Run database migrations
pnpm db:studio   # Open Drizzle Studio in browser
```
