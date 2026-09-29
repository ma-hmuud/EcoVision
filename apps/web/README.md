# EcoVision Web Application

Next.js 16 frontend application for the EcoVision AI waste analysis platform.

## Features

- **Framework**: Next.js 16 App Router with Turbopack.
- **Styling**: Tailwind CSS & shadcn/ui components.
- **State & Data**: TanStack Query for cache invalidation and query fetching.
- **Visuals**: Interactive bounding box rendering canvas over detected objects.
- **Authentication**: Better Auth client integration for Google OAuth.

## Pages

- `/` - Landing page with hero, value proposition, and workflows.
- `/dashboard` - Analytics dashboard with real-time statistics and category charts.
- `/analyze` - Drag-and-drop waste image uploader with scanning indicators.
- `/results/[id]` - Inspection view with image bounding boxes and disposal guidance.
- `/history` - Searchable, filterable audit log of past analyses.

## Development

```bash
pnpm dev       # Run Next.js dev server on port 3000
pnpm build     # Build production bundle
pnpm start     # Start production server
pnpm typecheck # Check TypeScript types
```
