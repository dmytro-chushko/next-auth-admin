# Next Auth Admin

Standalone Next.js App Router scaffold (Tailwind v4, shadcn/ui, next-intl EN/UK, theme toggle, Husky, FSD).

## Local setup

```bash
# Requires Node.js 24+
git clone <repo-url>
cd next-auth-admin
cp .env.example .env   # set DATABASE_URL + seed passwords
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en` or `/uk`).

### API docs (Scalar)

Domain **ts-rest** contracts are documented with Scalar:

- UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- OpenAPI JSON: [http://localhost:3000/api/docs/openapi.json](http://localhost:3000/api/docs/openapi.json)

Covered today: `GET /api/users/me`, avatar upload/confirm/delete, and `GET /api/register/eligibility`.

**Better Auth** protocol routes (`/api/auth/*` — sign-in, OAuth, password, sessions, self-delete, etc.) are **not** in this OpenAPI document. See [Better Auth docs](https://www.better-auth.com/docs). Session-protected domain calls need a browser session cookie (`better-auth.session_token`); log in in the same origin, then use Scalar “Try it”.

Production build locally:

```bash
npm run build
npm run start
```

## Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the Next.js development server           |
| `npm run build`        | Create an optimized production build           |
| `npm run start`        | Serve the production build                     |
| `npm run lint`         | Run ESLint (fails on any warning)              |
| `npm run format`       | Format project files with Prettier             |
| `npm run format:check` | Check Prettier formatting without writing      |
| `npm run fix`          | Auto-fix formatting and ESLint issues          |
| `npm run precheck`     | Run format check and lint (used by pre-commit) |
| `npm run check-types`  | Type-check with TypeScript (`tsc --noEmit`)    |
| `npm run prepare`      | Install Husky git hooks after `npm install`    |
| `npm run db:generate`  | Generate Prisma Client                         |
| `npm run db:migrate`   | Apply Prisma migrations (dev)                  |
| `npm run db:seed`      | Seed admin + user fixtures                     |
| `npm run db:studio`    | Open Prisma Studio                             |

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 + shadcn (new-york / zinc)
- next-intl (`en` / `uk`, `localePrefix: always`)
- `@teispace/next-themes` (light / dark / system)
- Prisma 7 + PostgreSQL + Better Auth
- ts-rest + Zod domain API; Scalar OpenAPI at `/api/docs`
- ESLint + Prettier + Husky pre-commit (`npm run precheck`)
