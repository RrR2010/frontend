<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Collaboration Guidelines

## Agent Roles

- **Backend Agent**: Works on business logic, API endpoints, database models, validation rules
- **Frontend Design Agent**: Works on UI components, pages, design system implementation
- **Documentation & Review Agent**: Searches documentation, fixes errors, validates code quality

### Documentation & Review Agent Responsibilities

- Use Context7 MCP to fetch up-to-date documentation for libraries/frameworks
- Review code for correctness and best practices
- Identify and fix errors pointed out by the user
- Run lint/typecheck commands to verify code quality
- Provide technical guidance when needed

## Communication Protocol

### README.md as Shared Context
Both agents should update `README.md` to maintain shared context:
- When adding new features, document the API endpoints and data types
- When implementing UI, document the component structure and props
- Keep it as the single source of truth for both agents

### Update Frequency
- Update README.md before starting a new feature area
- Include relevant sections: Architecture, API Endpoints, Types, Component Structure

### Learning-by-Doing Approach (Frontend Design)
The user (non-designer) wants to learn by implementing. Strategy:
1. I present the **overall phase concept**
2. I explain **first principles and logic** behind components
3. User attempts implementation
4. I review and provide feedback

---

## Current Project Context

**Viver Sorvete** - Multi-tenant SaaS for ice cream R&D management

### MVP Scope
- Login & Tenant selection
- CRUD for Items (ingredients, materials)
- CRUD for Users
- CRUD for Rules (legal requirements)
- Legal requirements validation of formulations

### Tech Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Multi-tenant with cookie-based authentication

### Design System
See `design.pen` for visual reference. Mobile-first approach with Atomic Design.

### Implementation Phases
- Phase 1: Foundation (Atomic Components)
- Phase 2: Authentication Pages
- Phase 3: Layout Shell (App Shell)
- Phase 4: Data Pages (CRUD)
- Phase 5: Validation Feature
