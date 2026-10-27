# Next Auth Admin

Standalone **Next.js App Router** starter with production-minded auth, a thin admin panel, typed domain APIs, and Feature-Sliced Design (FSD).

Use this repository as a **base for new apps and pet projects**: clone it, rename it, strip or extend features, keep the stack and folder conventions.

---

## What you get

| Area        | Capabilities                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Auth**    | Email/password, email verification (Resend), Google + GitHub OAuth, DB sessions, forgot/reset password, account linking |
| **Profile** | Name, avatar (Supabase Storage), set/change password, session-aware header menu                                         |
| **Admin**   | Overview KPIs, users list/detail, change role, revoke sessions, delete user (last-admin protected), audit logs          |
| **API**     | Better Auth at `/api/auth/*` + domain Route Handlers with **ts-rest** + **Zod**; OpenAPI → **Scalar** at `/api/docs`    |
| **UI / DX** | Tailwind v4, shadcn/ui, next-intl (`en` / `uk`), light/dark/system theme, Husky pre-commit, security worm-scan          |

Roles: `user` | `admin` (stored on the user; admin UI and `/admin/*` are admin-only).

---

## Stack

| Layer       | Choice                                                           |
| ----------- | ---------------------------------------------------------------- |
| Runtime     | Node.js **24+**, npm (`package-lock.json`)                       |
| App         | Next.js **16**, React **19**, TypeScript (strict)                |
| Styling     | Tailwind CSS **v4**, shadcn (new-york / zinc), Radix             |
| Auth        | [Better Auth](https://www.better-auth.com/docs) + Prisma adapter |
| Data        | Prisma **7** + PostgreSQL (`pg` driver adapter)                  |
| Contracts   | `@ts-rest/core` + Zod **4**                                      |
| Client data | TanStack Query + TanStack Table                                  |
| i18n        | next-intl (`localePrefix: always`)                               |
| Email       | Resend                                                           |
| Avatars     | Supabase Storage (service role, server-only)                     |
| Docs        | `@ts-rest/open-api` → Scalar                                     |
| Quality     | ESLint, Prettier, Husky, `scripts/security/worm-scan.sh`         |

---

## Architecture

Code under `src/` follows **FSD** (top → bottom: pages compose widgets/features; features use entities; shared has no feature imports).

```text
src/
├── shared/          # UI kit, auth helpers, Prisma, ts-rest contracts, hooks
├── entities/        # user, admin, audit-log (models + query hooks)
├── features/        # auth forms, admin tables, profile, theme, locale
├── widgets/         # app-header, admin/auth shells
├── views/           # optional page-level compositions
├── i18n/            # next-intl routing / navigation
└── generated/       # Prisma Client (do not edit by hand)

app/
├── [locale]/
│   ├── (auth)/          # login, register, verify, forgot/reset password
│   └── (protected)/     # dashboard, profile, admin/*
├── api/
│   ├── auth/[...all]/   # Better Auth
│   ├── users/…          # domain (me, avatar, password)
│   ├── admin/…          # stats, users, audit-logs
│   ├── register/…
│   └── docs/            # Scalar + openapi.json
proxy.ts                 # next-intl + auth/admin route guards
prisma/                  # schema, migrations, seed
messages/                # en.json, uk.json
```

**Auth vs domain API**

- `/api/auth/*` — Better Auth protocol (sign-in, OAuth, sessions, etc.). Not listed in Scalar.
- `/api/users/*`, `/api/admin/*`, … — app domain contracts. Session cookie required for protected ops; Scalar “Try it” works after you log in on the same origin.

Path alias: `@/*` → `./src/*`.

---

## Prerequisites

- **Node.js 24+**
- **PostgreSQL** (local or remote) reachable via `DATABASE_URL`
- Optional for full features:
  - Resend API key (email verification / password reset)
  - Google & GitHub OAuth apps
  - Supabase project + Storage bucket (avatars)

---

## Quick start

```bash
git clone <repo-url>
cd next-auth-admin

cp .env.example .env
# Fill DATABASE_URL, BETTER_AUTH_SECRET, seed passwords; add Resend/OAuth/Supabase as needed

npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en` or `/uk`).

Seed accounts come from `.env` (`SEED_ADMIN_*`, `SEED_USER_*`). Change those passwords before any shared or hosted use.

Production check:

```bash
npm run build
npm run start
```

---

## Environment variables

Copy from [`.env.example`](.env.example). Never commit `.env`.

| Variable                                              | Purpose                                         |
| ----------------------------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`                                        | PostgreSQL connection string                    |
| `BETTER_AUTH_SECRET`                                  | Auth signing secret (long random string)        |
| `BETTER_AUTH_URL`                                     | Public app origin, e.g. `http://localhost:3000` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`            | Prisma seed admin                               |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD`              | Prisma seed user                                |
| `RESEND_API_KEY` / `EMAIL_FROM`                       | Transactional email                             |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`           | Google OAuth                                    |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`           | GitHub OAuth                                    |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`          | Avatar storage (server only)                    |
| `SUPABASE_STORAGE_BUCKET` / `SUPABASE_AVATARS_PREFIX` | Bucket + object prefix                          |

OAuth callback URLs:

```text
{BETTER_AUTH_URL}/api/auth/callback/google
{BETTER_AUTH_URL}/api/auth/callback/github
```

---

## Scripts

| Script                            | Description                               |
| --------------------------------- | ----------------------------------------- |
| `npm run dev`                     | Dev server (`predev` runs security scan)  |
| `npm run build`                   | `prisma generate` + Next production build |
| `npm run start`                   | Serve production build                    |
| `npm run lint`                    | ESLint (zero warnings allowed)            |
| `npm run format` / `format:check` | Prettier write / check                    |
| `npm run fix`                     | Format + ESLint `--fix`                   |
| `npm run precheck`                | Format check + lint (Husky pre-commit)    |
| `npm run check-types`             | `tsc --noEmit`                            |
| `npm run db:generate`             | Prisma Client                             |
| `npm run db:migrate`              | `prisma migrate dev`                      |
| `npm run db:seed`                 | Seed admin + user                         |
| `npm run db:studio`               | Prisma Studio                             |
| `npm run security:scan`           | Local worm/malware heuristics scan        |

---

## Important URLs

| URL                                       | Description                  |
| ----------------------------------------- | ---------------------------- |
| `/en`, `/uk`                              | Locales (always prefixed)    |
| `/en/login`, `/en/register`               | Auth                         |
| `/en/dashboard`, `/en/profile`            | Authenticated app            |
| `/en/admin`                               | Admin overview KPIs          |
| `/en/admin/users`, `/en/admin/users/[id]` | User management              |
| `/en/admin/audit-logs`                    | Security event history       |
| `/api/docs`                               | Scalar UI for domain OpenAPI |
| `/api/docs/openapi.json`                  | OpenAPI document             |

---

## Using this repo as a template

1. Clone or use **GitHub → Use this template** (if enabled).
2. Rename the package in `package.json` and the database name in `DATABASE_URL`.
3. Rotate all secrets; never reuse seed passwords from examples.
4. Keep or drop modules by FSD slice:
   - Auth core → `src/shared/auth`, `src/features/auth`, `app/api/auth`
   - Admin → `src/features/admin`, `src/entities/admin`, `src/entities/audit-log`, `app/api/admin`
   - Profile / avatars → `src/features/profile`, `src/shared/storage`
5. Extend domain APIs via **Zod schemas + ts-rest contract + Route Handler**, then consume with TanStack Query hooks under `entities/` / `features/`.
6. Prefer adding UI with existing shadcn patterns under `src/shared/ui`.

Roadmap / decision log (auth + admin stages): [`.cursor/roadmaps/nextjs-auth-admin.md`](.cursor/roadmaps/nextjs-auth-admin.md).

---

## Conventions

- **English** for code, commits, and project docs in this repository.
- **FSD imports**: features must not import other features; prefer entities + shared.
- **Client barrels**: do not re-export Prisma/server modules from entity barrels used by client components (deep-import server helpers in Route Handlers).
- **Responsive**: `useIsMobile()` is below 768px (tables → cards); sidebar Sheet mode uses `useMaxWidth(992)`.
- **i18n**: user-facing strings in `messages/en.json` and `messages/uk.json`.
- **Commits**: short imperative subject (e.g. `Add admin audit table`); commit only when asked if working with the agent workflow.

---

## Security notes

- `BETTER_AUTH_SECRET` and Supabase **service role** key stay server-side only.
- Pre-commit runs `worm-scan` + `precheck`; `predev` / `prebuild` also scan.
- Admin mutations enforce last-admin / self-delete policies; audit events are recorded for security-relevant actions.
- Domain admin routes use `requireAdminApiSession`; UI routes are guarded in `proxy.ts` + server layouts.

---

## License

Private project (`"private": true` in `package.json`). Adjust license and visibility before publishing or sharing as an open template.
