# Expense Tracker — React Edition

A React frontend for **Expense Tracker**, the full-stack personal finance app. This app is the React + Vite edition of the original vanilla-JavaScript dashboard: it talks to the same Express + MongoDB REST API, with JWT authentication, live totals, a category breakdown and monthly reports — all charts hand-rolled with plain CSS, no chart library.

> Backend: the original [`expense-tracker`](https://github.com/triptikarn/expense-tracker) repository (Express + MongoDB + JWT). This repo contains only the React frontend.

## Features

- **User accounts** — register & login against the Expense Tracker API (with a per-account currency); the JWT is stored in `localStorage` and sent as `Authorization: Bearer <token>`
- **Protected routes** — the dashboard is only reachable when logged in (React Router route guard)
- **Live dashboard** — total income, total expenses, balance and entry count for the selected month, from the API's `/summary` endpoint
- **Entries** — add, edit and delete income/expense entries (amount, category, note, date), filterable by month and category
- **Category breakdown** — spending per category as a proportional bar chart
- **Monthly totals** — income vs expenses per month as a grouped bar chart, from the `/monthly` endpoint
- **Careful formatting** — every amount rendered in the account's own currency

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, React Router |
| Backend  | Node.js, Express (separate repo) |
| Database | MongoDB with Mongoose (via the backend) |
| Auth     | JSON Web Tokens (JWT) |

## Getting started

You need the backend running first:

```bash
# 1) Backend (from the original expense-tracker repo)
git clone https://github.com/triptikarn/expense-tracker.git
cd expense-tracker
npm install
cp .env.example .env   # fill in MONGO_URI and a strong JWT_SECRET
npm run dev            # API on http://localhost:5001

# 2) This frontend (in a second terminal)
git clone https://github.com/triptikarn/expense-tracker-react.git
cd expense-tracker-react
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5001
npm run dev            # app on http://localhost:5173
```

## Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
npm test         # Vitest unit/component tests
```

## Project structure

```
expense-tracker-react/
├── src/
│   ├── api/client.js         # fetch wrapper: base URL, JWT header, error handling
│   ├── context/AuthContext   # user session (login / register / logout)
│   ├── components/           # Navbar, ProtectedRoute, ExpenseForm, ExpenseList,
│   │                         # CategoryChart, MonthlyChart
│   ├── pages/                # Login, Register, Dashboard
│   └── utils/money.js        # currency/month helpers + backend category list
├── .env.example              # VITE_API_URL for the backend
└── vite.config.js
```

## Screenshots

<!-- TODO: add screenshots of the login page and the dashboard here. -->
_Screenshots coming soon._

## License

MIT © Tripti Karn
