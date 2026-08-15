# 📐 Document 2: Conventions & Architecture
## Gimoreni — *Gimme More Money*

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Language** | TypeScript | Strict mode enabled everywhere |
| **Backend Runtime** | Node.js + Express.js | Housed in `api/` directory |
| **Frontend Framework** | React.js | Housed in `app/` directory |
| **Architecture Pattern** | Domain-Driven Design (DDD) | Enforced on both frontend and backend |
| **Styling** | Tailwind CSS | Single config at root or per package |
| **UI Components** | Shadcn UI | Components installed in `app/src/components/ui/` |
| **Database** | Supabase (PostgreSQL) | Managed via Prisma ORM |
| **ORM** | Prisma | Schema in `api/prisma/schema.prisma` |
| **Notifications (transient)** | `toast` (Sonner or react-hot-toast) | For non-blocking feedback |
| **Notifications (interactive)** | Custom Component | `app/src/components/notifications/` |
| **Image Compression** | `browser-image-compression` | Client-side only, pre-upload |

---

## 2. Monorepo Directory Structure

```
gimoreni/
├── api/                          # Backend — Express.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── domains/              # DDD: one folder per domain
│   │   │   ├── auth/
│   │   │   │   ├── auth.router.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.dto.ts
│   │   │   ├── users/
│   │   │   │   ├── users.router.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.repository.ts
│   │   │   │   └── users.dto.ts
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── quests/
│   │   │   ├── redemptions/
│   │   │   ├── bonuses/
│   │   │   └── streaks/
│   │   ├── shared/
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rateLimit.middleware.ts
│   │   │   │   ├── pagination.middleware.ts
│   │   │   │   └── errorHandler.middleware.ts
│   │   │   ├── utils/
│   │   │   │   ├── response.util.ts
│   │   │   │   ├── pagination.util.ts
│   │   │   │   └── date.util.ts
│   │   │   ├── types/
│   │   │   │   └── express.d.ts   # Augment Express Request type
│   │   │   └── constants/
│   │   │       └── roles.ts
│   │   ├── config/
│   │   │   ├── env.ts             # Zod-validated env vars
│   │   │   └── supabase.ts
│   │   └── app.ts                 # Express app factory
│   ├── index.ts                   # Entry point
│   ├── tsconfig.json
│   └── package.json
│
├── app/                           # Frontend — React.js
│   ├── public/
│   ├── src/
│   │   ├── domains/               # DDD: mirrored frontend domains
│   │   │   ├── auth/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   └── components/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── quests/
│   │   │   ├── bonuses/
│   │   │   └── streaks/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── ui/            # Shadcn components live here
│   │   │   │   ├── layout/
│   │   │   │   │   ├── AdminLayout.tsx
│   │   │   │   │   └── UserLayout.tsx
│   │   │   │   └── notifications/
│   │   │   │       ├── NotificationBell.tsx
│   │   │   │       └── InteractiveNotification.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── usePagination.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts         # Axios/fetch instance
│   │   │   │   └── imageCompression.ts
│   │   │   ├── types/
│   │   │   └── constants/
│   │   ├── pages/
│   │   │   ├── user/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── AddPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── CalendarPage.tsx
│   │   │       ├── QuestsPage.tsx
│   │   │       ├── UsersPage.tsx
│   │   │       └── MiscPage.tsx
│   │   ├── router/
│   │   │   ├── AppRouter.tsx
│   │   │   ├── AdminRoutes.tsx    # Protected — ADMIN only
│   │   │   └── UserRoutes.tsx     # Protected — USER only
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── tsconfig.json
│   └── package.json
│
├── shared-types/                  # (Optional) Shared TS types
│   └── index.ts
├── .env
├── .env.example
└── package.json                   # Root workspace config
```

---

## 3. Domain-Driven Design (DDD) Conventions

### 3.1 Backend Domain Layer Anatomy

Each domain in `api/src/domains/<domain>/` follows a strict 4-layer pattern:

| File | Responsibility |
|---|---|
| `*.router.ts` | Express router — define routes, attach middleware |
| `*.controller.ts` | Handle HTTP request/response cycle, call service |
| `*.service.ts` | Business logic, orchestration |
| `*.repository.ts` | Prisma queries — ONLY DB access lives here |
| `*.dto.ts` | Zod schemas for request validation (input DTOs) |

> [!IMPORTANT]
> **Controllers must never directly call Prisma.** They go through the service. **Services must never instantiate HTTP objects** (`req`, `res`). They are pure business logic.

### 3.2 Frontend Domain Layer Anatomy

Each domain in `app/src/domains/<domain>/` follows:

| Folder/File | Responsibility |
|---|---|
| `hooks/use<Domain>.ts` | Data fetching logic (React Query or SWR), state |
| `pages/<Page>.tsx` | Full-page component, composes other components |
| `components/<Component>.tsx` | Domain-specific UI components |
| `types.ts` | Domain-specific TypeScript interfaces |

---

## 4. Naming Conventions

### 4.1 Files & Folders
| Type | Convention | Example |
|---|---|---|
| Folders | `kebab-case` | `quest-redemptions/` |
| React Components | `PascalCase.tsx` | `QuestCard.tsx` |
| TypeScript files (non-component) | `camelCase.ts` | `auth.service.ts` |
| Prisma schema | `schema.prisma` | — |
| Environment variables | `SCREAMING_SNAKE_CASE` | `SUPABASE_URL` |

### 4.2 Code Symbols
| Type | Convention | Example |
|---|---|---|
| React Components | `PascalCase` | `function QuestCard()` |
| Hooks | `camelCase` with `use` prefix | `useQuestRedemption` |
| Variables / Functions | `camelCase` | `getUserById` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_STREAK_DAYS` |
| TypeScript Types/Interfaces | `PascalCase` | `type UserRole = ...` |
| Prisma Models | `PascalCase` | `model QuestRedemption` |
| DB column names | `snake_case` | `created_at`, `user_id` |
| API route segments | `kebab-case` | `/quest-redemptions` |

### 4.3 Variable Naming Standards
- **Boolean flags**: Prefix with `is`, `has`, `can`, `should` (e.g., `isLoading`, `hasCompletedTutorial`).
- **Async functions**: Name clearly with verb + noun (e.g., `fetchUserById`, `createTransaction`).
- **Event handlers**: Prefix with `handle` (e.g., `handleSubmit`, `handleQuestClaim`).

---

## 5. Code Constraints

> [!CAUTION]
> **Hard Limit: ≤ 300 lines of code per file.** This is non-negotiable. If a file approaches or exceeds this limit, refactor immediately by extracting logic into sub-modules.

### Refactoring Strategies
- Extract pure utility logic into `utils/` files.
- Extract Prisma queries into a dedicated `*.repository.ts` file.
- Split large React components into smaller child components.
- Move complex hook logic into a dedicated `hooks/` file.
- Extract repeated validation into shared Zod schemas.

---

## 6. API Conventions

### 6.1 URL Structure
```
Base URL: /api/v1

Pattern: /api/v1/<domain>/<resource>/<id>/<sub-resource>

Examples:
  POST   /api/v1/auth/login
  GET    /api/v1/users
  GET    /api/v1/users/:id
  POST   /api/v1/transactions
  GET    /api/v1/quests/:id/redemptions
  PATCH  /api/v1/quests/:id/redemptions/:redemptionId/confirm
```

### 6.2 Standard Response Envelope

All API responses must conform to this envelope:

```typescript
// Success
{
  "success": true,
  "data": <payload>,
  "meta": {           // Only on paginated responses
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You do not have permission to perform this action."
  }
}
```

### 6.3 HTTP Status Codes
| Situation | Status Code |
|---|---|
| Success (read) | `200 OK` |
| Success (created) | `201 Created` |
| Success (no content) | `204 No Content` |
| Bad request / validation | `400 Bad Request` |
| Unauthenticated | `401 Unauthorized` |
| Forbidden (wrong role) | `403 Forbidden` |
| Not found | `404 Not Found` |
| Rate limit exceeded | `429 Too Many Requests` |
| Server error | `500 Internal Server Error` |

### 6.4 Rate Limiting (Global)
- **Library**: `express-rate-limit`
- **Window**: 15 minutes
- **Max requests per window**: 100 (general) / 10 (auth endpoints)
- Applied as the **first middleware** in `app.ts`, before all routes.

### 6.5 Pagination (Global)
All `GET` list endpoints accept:
```
?page=1&limit=20
```
- Default `limit`: 20, Max `limit`: 100.
- Applied via `pagination.middleware.ts` that attaches `req.pagination` to the request.

---

## 7. Authentication & Authorization

### 7.1 JWT Strategy
- **Access Token**: Short-lived (15 min), sent in `Authorization: Bearer <token>` header.
- **Refresh Token**: Long-lived (7 days), stored in `HttpOnly` cookie.
- The `auth.middleware.ts` verifies the JWT and attaches the decoded user (`req.user`) to the request.

### 7.2 Role Guard Middleware
```typescript
// Usage in router:
router.get('/users', authenticate, requireRole('ADMIN'), usersController.getAll);

// requireRole implementation (shared middleware):
export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN' } });
    }
    next();
  };
```

### 7.3 Roles Enum
```typescript
// api/src/shared/constants/roles.ts
export const Role = {
  ADMIN: 'ADMIN',
  USER:  'USER',
} as const;

export type Role = keyof typeof Role;
```

---

## 8. Environment Variables

All environment variables are validated at startup using **Zod** in `api/src/config/env.ts`.

```typescript
// .env.example
NODE_ENV=development
PORT=3001

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

---

## 9. Error Handling

- A global `errorHandler.middleware.ts` catches all unhandled errors from controllers.
- Controllers use `try/catch` and pass errors to `next(error)`.
- Custom error classes (e.g., `AppError`, `NotFoundError`, `ForbiddenError`) extend the base `Error` class and carry an HTTP status code.

```typescript
// api/src/shared/utils/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
```

---

## 10. Frontend Conventions

### 10.1 State Management
- **Server state**: React Query (`@tanstack/react-query`) — all API calls go through React Query hooks.
- **Client/UI state**: React `useState` / `useContext` — for local UI interactions, tutorial state, etc.
- **Auth state**: `AuthContext` wrapping the app, populated from the JWT payload.

### 10.2 API Client
- A single Axios instance in `app/src/shared/lib/api.ts` with:
  - Base URL set from `VITE_API_URL` env variable.
  - Request interceptor: attaches `Authorization` header.
  - Response interceptor: handles `401` by attempting token refresh, then logging out.

### 10.3 Image Compression Wrapper
```typescript
// app/src/shared/lib/imageCompression.ts
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,       // 500KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return imageCompression(file, options);
};
```

> [!WARNING]
> **Never call a file upload API directly with a raw `File` object.** Always run it through `compressImage()` first.

### 10.4 Routing Guard
- `AdminRoutes.tsx` wraps all `/admin/*` routes with a role check. Redirects to `/` if the user is `USER`.
- `UserRoutes.tsx` wraps all user routes. Redirects to `/admin` if the user is `ADMIN`.

### 10.5 Tutorial Trigger Logic
```typescript
// In UserLayout.tsx or root User page:
useEffect(() => {
  if (user && !user.hasCompletedTutorial) {
    setShowTutorial(true);
  }
}, [user]);
```
After the user completes the tutorial, call `PATCH /api/v1/users/me` to set `hasCompletedTutorial: true`.

---

## 11. Git & Commit Conventions

| Type | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code restructure, no behavior change |
| `chore:` | Dependency updates, config changes |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `test:` | Adding or updating tests |

**Branch naming**: `feat/<domain>/<short-description>` (e.g., `feat/quests/add-redemption-flow`)

---
