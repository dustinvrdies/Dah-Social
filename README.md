# Dah Social

Full-stack monorepo for **DAH Social**.

## Stack
- **Client:** React + Vite + TypeScript + Tailwind
- **Server:** Node.js + TypeScript
- **DB/ORM:** Drizzle

## Local development

### 1) Install
```bash
npm install
```

### 2) Configure environment
This project uses environment variables for runtime configuration (database URL, etc.).
Create a `.env` file (do **not** commit it) and set at least:
```bash
DATABASE_URL=...
```

### 3) Run
```bash
npm run dev
```

## Database
Push schema changes (Drizzle):
```bash
npm run db:push
```

## Build & start
```bash
npm run build
npm start
```

## Notes
- Keep secrets in environment variables / Replit Secrets (never commit `.env`).
- `node_modules/` and build outputs are ignored via `.gitignore`.
