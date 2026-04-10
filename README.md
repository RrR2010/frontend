# Viver Sorvete - Frontend

## Project Overview

Multi-tenant SaaS for ice cream shop formulation management system. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

---

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Login page
│   ├── tenant/             # Tenant selection page (pending)
│   ├── dashboard/         # Main dashboard (pending)
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── globals.css         # Design tokens & theme
│   └── page.tsx            # Redirects to /login
├── contexts/               # React Context providers
│   └── AuthContext.tsx     # Authentication state & logic
├── lib/api/                # API layer
│   ├── client.ts           # Axios instance with credentials
│   └── auth.ts             # Auth functions (login, selectTenant, logout)
├── types/                  # TypeScript type definitions
│   └── auth.ts             # Auth-related types
└── components/             # Reusable UI components (to be created)
```

---

## Backend Integration

### API Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Authentication Flow (Cookie-Based)

```
1. POST /auth/login { email, password }
   → Backend sets preAuthToken cookie (HttpOnly, 5min TTL)
   → Returns: { user: { id, name, email }, tenants: [{ id, name }] }

2. POST /auth/select-tenant { tenantId }
   → Browser automatically sends preAuthToken cookie
   → Backend clears preAuthToken cookie
   → Backend sets accessToken cookie (HttpOnly, 1hr TTL)
   → Returns: {} (empty)

3. All subsequent requests → Browser sends accessToken cookie automatically
```

### API Endpoints

| Method   | Endpoint              | Auth              | Description                    |
| -------- | --------------------- | ----------------- | ------------------------------ |
| POST     | `/auth/login`         | ❌                | Login with email/password      |
| POST     | `/auth/select-tenant` | ✅ (preAuthToken) | Select tenant, get accessToken |
| POST     | `/auth/logout`        | ✅                | Clear cookies                  |
| GET/POST | `/users/*`            | ✅                | User management                |
| GET/POST | `/tenants/*`          | ✅                | Tenant management              |
| GET/POST | `/memberships/*`      | ✅                | User-Tenant roles              |

### Error Handling

Backend returns errors in format:

```ts
{
  message: string,    // Human readable
  error: string,      // Error code (e.g., "INVALID_CREDENTIALS")
  statusCode: number  // HTTP status (400, 401, etc.)
}
```

---

## Auth Context (`src/contexts/AuthContext.tsx`)

Provides global authentication state to all components:
1

```ts
type AuthContextType = {
  user: User | null; // Logged in user
  tenant: Tenant | null; // Selected tenant
  tenants: Tenant[]; // All tenants user belongs to
  isAuthenticated: boolean; // Has user + tenant
  isLoading: boolean; // Still checking session
  login: (params) => Promise<LoginResponse>;
  selectTenant: (tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
};
```

**Usage in components:**

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, tenant, logout } = useAuth();
  // ...
}
```

---

## Design Tokens (`src/app/globals.css`)

CSS variables for theming (easily changeable):

```css
:root {
  --color-primary: #98d8c8; /* Mint green */
  --color-primary-light: #b8e8dc;
  --color-primary-dark: #7bc4b0;
  --color-secondary: #f7b7c3;
  --color-surface: #ffffff;
  --color-background: #fafafa;
  --color-text-primary: #1a1a1f;
  --color-text-secondary: #6b6b75;
  --color-border: #e5e5ea;
  --color-warning: #ff9800;
  --color-error: #e53935;
  --color-info: #2196f3;
  --color-success: #4caf50;
  --color-sidebar-bg: #f0f7f5;
  --color-topbar-bg: #ffffff;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

**Tailwind usage:** `bg-primary`, `text-text-secondary`, `rounded-md`, etc.

---

## Types (`src/types/auth.ts`)

```ts
export type User = { id: string; name: string; email: string };
export type Tenant = { id: string; name: string };

export type LoginResponse = {
  user: User;
  tenants: Tenant[];
};

export type SelectTenantResponse = void; // Empty response

export type ApiError = {
  statusCode: number;
  message: string;
  code: string;
};
```

---

## API Client (`src/lib/api/client.ts`)

Axios instance configured for cookie-based auth:

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Sends cookies with requests
  headers: { 'Content-Type': 'application/json' },
});
```

**Key:** `withCredentials: true` is essential for cookies to work.

---

## Pending Work

- [ ] Login page UI implementation
- [ ] Tenant selection page
- [ ] Dashboard page
- [ ] Toast notification system
- [ ] UI components (Button, Input, Card, etc.)
- [ ] Sidebar/Navigation component

---

## Running the Project

```bash
npm run dev      # Start Next.js dev server (port 3001)
npm run build    # Production build
npm run lint     # ESLint check
```

**Note:** Backend must be running on `http://localhost:3000` with CORS configured to allow `localhost:3001`.

---

## Design Reference

See `design.pen` for visual mockups (Pencil app). Contains:

- Login screen
- Tenant selection screen
- Dashboard screen
- Mobile variants

---

## Implementation Roadmap

### Phase 1: Foundation (Atomic Components)

**Goal**: Build reusable design system primitives (atoms/molecules)

| Priority | Component | Purpose |
|----------|-----------|---------|
| 1 | `Button` | Primary, Secondary, Ghost, Destructive, Sizes |
| 2 | `Input` | Text, Select, Checkbox, Radio |
| 3 | `Card` | Container for content |
| 4 | `Alert` | Success, Error, Warning, Info |
| 5 | `Toast` | Notification system |
| 6 | `Modal` | Dialog overlays |

**File Structure**:
```
src/components/ui/
├── atoms/
│   ├── Button/
│   ├── Input/
│   └── Card/
├── molecules/
│   ├── FormField.tsx
│   └── ToastContainer.tsx
└── organisms/
    └── Modal/
```

### Phase 2: Authentication Pages
- Login page (centered card, responsive)
- Tenant selection page

### Phase 3: Layout Shell (App Shell)
- Sidebar (desktop 260px, mobile drawer)
- Topbar (logo, search, notifications, user menu)
- AppShell component

### Phase 4: Data Pages (CRUD)
- User CRUD (List, Create, Edit)
- Item CRUD (List, Create, Edit)
- Rules CRUD (List, Create, Edit)
- Supporting: Table, Pagination, Search, EmptyState, Loading

### Phase 5: Validation Feature
- Formulation editor
- Validation results display
- Rule indicators
