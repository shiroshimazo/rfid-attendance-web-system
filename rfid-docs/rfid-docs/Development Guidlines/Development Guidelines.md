## Technology Rules

Frontend:
- Next.js 16.1.1
- React 19.2.3
- TypeScript
- Tailwind CSS
- shadcn/ui


Backend:
- Supabase
- PostgreSQL


## Coding Principles

- Use TypeScript strictly.
- Follow component-based architecture.
- Keep components reusable.
- Avoid duplicate code.
- Use clear naming conventions.


## Folder Structure

src/

components/
- reusable UI components

features/
- business logic per module

app/
- routes and pages

lib/
- configurations

services/
- API and database functions


## UI Guidelines

- Use shadcn/ui components.
- Follow consistent spacing.
- Use responsive design.
- Use modal forms for adding/editing data.


## Database Rules

- Never directly expose sensitive data.
- Use Supabase Row Level Security.
- Validate data before inserting.


## Security Rules

- Never store plain passwords.
- Use Supabase Authentication.
- Apply role-based access.


## Git Rules

- Small meaningful commits.
- Do not rewrite working modules.
- Test before merging.

Related Documents:
[[System Architecture]]
[[Functional Requirement]]