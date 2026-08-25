# Couples' Monthly Budget Tracker

Full-stack budget tracking app for couples — manual income/expense entry, household sharing, and monthly summaries.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Sequelize
- **Database:** PostgreSQL

## Quick Start

### 1. Database

Create the PostgreSQL database:

```bash
createdb budget_tracker_dev
```

Or via psql:

```sql
CREATE DATABASE budget_tracker_dev;
```

### 2. Backend

```bash
cd backend
# Update .env with your PostgreSQL password
npm run migrate
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

## Phase 1 Features

- User signup & login (JWT)
- Create / join household via invite code
- Add income & expense transactions
- View, edit, delete transactions
- Dashboard with summary cards (income, expenses, net balance)

## Phase 2 Features

- Category breakdown pie chart & daily spending trend line chart
- Income vs. expenses bar chart
- Monthly Review page (`/monthly-review`) with printable PDF export
- Shareable report link — generates a public, no-login-required URL (`/shared/:token`, valid 90 days) for a given household + month
- Dark mode toggle, persisted across sessions, respects system preference on first visit

## Phase 3 Features

- Search transactions by description or category, plus filters for type, category, and custom date range
- Bill tracker (`/bills`): mark a transaction as a recurring monthly bill with an optional due day, and log a payment with one click
- Every transaction shows which partner recorded it

## Phase 4 Features

- **Budget limits & alerts** (`/settings`): set a monthly spending limit per category; the Dashboard shows a warning banner once a category hits 80% of its limit
- **Budget vs. actual**: comparison chart and a color-coded category breakdown table (red ≥100%, amber ≥80%, green below) on the Monthly Review page
- **Savings goals** (`/goals`): create goals with an optional target date, log progress, and track % complete
- **Month-over-month comparison**: income/expense/balance diffed against the previous month, on the Monthly Review page
- **Yearly trends** (`/analytics`): rolling 12-month income/expense/net chart
- **Net worth**: all-time income minus all-time expenses, shown as a card on the Dashboard

New backend routes live in `backend/routes/budget.js`, mounted at `/api/budget`. No new migrations were needed — `BudgetLimits` and `SavingsGoals` already existed in the schema.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

⚠️ Update `DB_PASSWORD` in `backend/.env` to match your local PostgreSQL credentials.

## Notes on this build

- Fixed a bug where adding any transaction failed with `column "HouseholdId" does not exist`. The `Transaction`, `BudgetLimit`, and `SavingsGoal` models were missing an explicit `foreignKey` on their `Household` association, so Sequelize generated a phantom column instead of using the real `householdId` column from the migration. This is fixed in `backend/models/`.
- Backend routes now return clean `400` responses for bad input (invalid email, duplicate email, etc.) instead of raw `500` errors — see `backend/utils/errorHandler.js`.
- `node_modules/` is intentionally not included — run `npm install` in both `backend/` and `frontend/` before starting.
