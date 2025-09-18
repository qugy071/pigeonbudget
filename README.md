# 🐦 Pigeon Budget

A modern, high-fidelity budgeting web application built with **React (Vite + TypeScript)**, **TailwindCSS**, and **Zustand**.  
It helps students and young families track income, expenses, savings goals, and gain financial insights — with both desktop and mobile optimized layouts.

---

## ✨ Features

- **Dashboard Overview**  
  Summarized KPIs (Income / Expense / Net), daily net flow line chart, and expense breakdown by category.

- **Transactions Management**  
  - Add new transactions with date, type, merchant, category, and amount.  
  - Inline deletion with undo support.  
  - Search and filter for quick access.

- **Budgets**  
  - Create/update budgets by category.  
  - Visual progress bars with over-budget warnings.

- **Savings Goals**  
  - Define goals with target amount and date.  
  - Update savings via quick increment buttons (+50, +100, +500) or custom amounts.  
  - Progress bar with dynamic monthly suggestion.

- **Insights**  
  - Daily expenses chart and category pie chart.  
  - Supports light/dark mode with adjusted colors.

- **Premium Upgrade (A$10/month demo)**  
  - Unlocks auto-categorisation, CSV import/export, multi-accounts, family sharing, smart alerts, and priority support.  
  - State stored locally (no real payment).

- **Mobile Responsive Design**  
  - Five-tab bottom navigation (Home, Dashboard, Transactions, Budgets, Goals/Insights).  
  - Optimized layouts for smaller screens.

---

## 🛠 Tech Stack

- **Frontend:** React 18 (Vite + TypeScript)  
- **State Management:** Zustand + Middleware  
- **Styling:** TailwindCSS, custom dark mode  
- **Forms & Validation:** React Hook Form + Zod  
- **Charts:** Recharts  
- **Internationalization:** i18next (future extension)

---

## 📂 Project Structure

```bash
pigeon-budget/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons
│   ├── components/       # Shared UI components
│   ├── pages/            # Route-based pages (Home, Dashboard, etc.)
│   ├── store/            # Zustand store (state management)
│   ├── App.tsx           # Root app
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind base styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
