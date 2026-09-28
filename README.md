# pocketED

A mobile app that helps students track where their money goes: log income and expenses, set a budget, and see the balance update in real time.

Group project of four for the Software Engineering course at FEUP (2025/26), run with Scrum and a lot of pair programming.

## What it does

- Record income (scholarships, allowance) and expenses.
- Set a monthly budget and watch the remaining balance.
- Organize spending into categories and review totals per category.
- A dashboard with the current balance and simple spending statistics.
- User accounts with registration, login and a profile (including a profile photo).

## Stack

Expo / React Native with TypeScript on the front end; a .NET (ASP.NET Core) REST API with SQLite on the back end. Testing with Jest and React Native Testing Library, end-to-end flows with Maestro, and continuous integration on GitHub Actions.

## How to run

```bash
cd mobile-app
npm install
npm test          # unit tests
npm start         # Expo dev server
```

Requires Node 20. The `.NET` API lives in `backend/` and is started with `dotnet run`. The mobile app reads its API base URL from `EXPO_PUBLIC_API_BASE_URL`.

> The backend is a course prototype: it stores passwords in plain text and has no token auth. It is for demonstration only and its README says so plainly.
