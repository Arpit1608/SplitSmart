# SplitSmart

An expense-splitting app (a Splitwise-style tool) with groups, shared and personal expenses, monthly insights, group chat, and recipient-confirmed settlements.

- **Frontend:** React + Vite (`client/`)
- **Backend:** Node.js + Express (`server/`)
- **Storage:** a JSON file (`server/data/data.json`) - simple to run, easy to swap for a real database later

## Requirements
Node.js 20 or newer.

## Run it

```bash
npm install        # once - installs both client and server
npm run dev        # starts API on :4000 and the React app on :5173
```

Open **http://localhost:5173**.

### Run it as a single server (production style)
```bash
npm run build      # builds the React app into client/dist
npm start          # Express serves the API *and* the built app on http://localhost:4000
```

### Other commands
| Command | What it does |
| --- | --- |
| `npm test` | Runs the server tests (split/balance maths + full API flow) |
| `npm run dev -w server` | Only the API (auto-restarts on change) |
| `npm run dev -w client` | Only the React dev server |

Copy `.env.example` to `.env` to change the port or database location.

## Project structure

```
SplitSmart/
├── package.json            # root: npm workspaces + shortcut scripts
├── .env.example
├── client/                 # React app (Vite)
│   ├── index.html
│   ├── vite.config.js      # proxies /api -> :4000 during development
│   └── src/
│       ├── main.jsx        # entry point
│       ├── App.jsx         # route table + login gate
│       ├── api/            # client.js (fetch wrapper) + index.js (one function per endpoint)
│       ├── context/        # Auth, Data (groups/settlements/...), Modal, Toast
│       ├── hooks/          # useForm
│       ├── utils/          # money/date formatting, constants, CSV export
│       ├── components/
│       │   ├── layout/     # Sidebar, Topbar, MobileNav, AppLayout
│       │   ├── ui/         # Avatar, Modal, Field, StatCard, EmptyState
│       │   ├── groups/     # GroupCard, ExpenseRow, and the four group tabs
│       │   └── modals/     # Group, Expense, PersonalExpense, Settlement dialogs
│       ├── pages/          # one file per screen
│       └── styles/         # CSS split by purpose
└── server/
    ├── data/               # data.json lives here (git-ignored)
    ├── test/
    └── src/
        ├── index.js        # starts the server
        ├── app.js          # Express setup
        ├── config/env.js   # environment settings
        ├── db/store.js     # load/save the JSON database
        ├── routes/         # URL -> controller
        ├── controllers/    # read the request, call a service, send the response
        ├── services/       # the real logic: auth, groups, expenses, balances, settlements...
        ├── middleware/     # requireAuth, loadGroup, error handling
        └── utils/          # HttpError, money/id helpers
```

**How a request flows:** `routes` → `middleware` (login check) → `controller` → `service` → `db/store`. When you want to change *what the app does*, edit a service. To change *which URLs exist*, edit routes.

## Moving your existing data
If you already used the old version, copy its `data.json` to `server/data/data.json` before starting. No conversion is needed.

## How it works
- **Accounts:** unique username + email + password (hashed with Node's built-in `scrypt`).
- **Money** is stored as whole paise, so there are no floating-point rounding errors. Equal splits give any leftover paise to the first participants.
- **Balances** come from expense shares plus *confirmed* settlements; the app suggests the smallest set of payments to settle up.
- **Settlements** are claims ("I paid you ₹500 by UPI"). Nothing changes until the recipient confirms. No real money moves in the app.
- **Chat** refreshes automatically every few seconds while the Chat tab is open.

## Before putting it on the internet
Sessions are kept in server memory (a restart logs everyone out) and data is a JSON file. For a public deployment use HTTPS, a real database (SQLite/PostgreSQL), persistent sessions, rate limiting, and backups.
