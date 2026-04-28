# pocketED Testing Plan

This document is the working plan for building automated tests on the `tests`
branch. The current priority is the mobile UI: stable selectors, Maestro
acceptance flows, and mobile unit/component tests. Backend testing is deferred
until the UI suite is useful and the team has time left.

## Current Repository Map

- Root solution: `T1.sln`.
- Backend API: `backend/PocketED.Api`.
- Backend stack: ASP.NET Core 10, Entity Framework Core, SQLite, Scalar API UI.
- Backend runtime database: `backend/PocketED.Api/pocketed.db`.
- Mobile app: `mobile-app`.
- Mobile stack: Expo SDK 54, React Native 0.81, React 19, Expo Router,
  TypeScript strict mode, React Context for auth state.
- Mobile API layer: `mobile-app/src/services`.
- Mobile screens: `mobile-app/src/screens`.
- Acceptance tests: `mobile-app/.maestro`.
- Local WSL/Android helpers: `mobile-app/scripts/maestro-wsl.sh` and
  `mobile-app/scripts/wsl-adb.sh`.
- Generated or local-only folders that should not be test targets:
  `mobile-app/node_modules`, `mobile-app/.expo`,
  `backend/PocketED.Api/bin`, and `backend/PocketED.Api/obj`.

## Current Testing State

- Backend has no test project and is intentionally out of scope for the first
  testing commits.
- Mobile has no `test` script in `mobile-app/package.json`.
- Mobile has lint configured through Expo, but no unit test runner configured.
- Existing Maestro YAML files are a useful start, but several are placeholders
  or reference older UI labels and dollar values while the current app displays
  euro-formatted values and labels such as `Income`, `Expense`, and `Budget`.
- The backend API uses a hard-coded SQLite database path in `Program.cs`, which
  makes isolated integration tests harder until the database configuration is
  made injectable.
- The mobile app has hard-coded API base URLs in both `api.ts` and
  `expenseService.ts`, which makes deterministic tests harder until the URL is
  centralized and can be overridden for tests.
- The mobile UI mostly relies on visible text for automation. Stable `testID`
  and accessibility labels should be added before Maestro flows are considered
  reliable.

## Testing Goals

- Protect the mobile financial calculations, auth state, UI behavior, and user
  story flows with fast automated tests.
- Keep tests deterministic, isolated, and runnable by every team member.
- Split the suite into layers so small changes get fast feedback and complete
  user journeys still get verified before delivery.
- Make every Sprint story traceable to at least one acceptance test and one
  lower-level regression test where relevant.
- Keep the documentation current in the repository so the test approach is part
  of the project, not tribal knowledge.

## Branch And Commit Workflow

The testing work should happen on the existing branch:

```bash
git switch tests
git status --short --branch
```

Before making a commit, check what changed:

```bash
git diff
git status --short
```

Make many small commits. Each commit should leave the repo in a coherent state.
Good UI-first commit slices are:

1. `docs: add testing strategy`
2. `test: add stable mobile automation selectors`
3. `test: stabilize maestro acceptance flows`
4. `test: add mobile jest harness`
5. `test: cover mobile auth and expense services`
6. `test: cover mobile screen interactions`
7. `ci: run mobile tests`
8. `docs: update coverage and test commands`
9. `test: add backend test project`
10. `test: cover backend user endpoints`
11. `test: cover backend expense and budget endpoints`

Stage only the files that belong to each slice:

```bash
git add README.md resources/testing/testing-plan.md
git commit -m "docs: add testing strategy"
```

For later implementation commits, use the same pattern:

```bash
git add mobile-app/package.json mobile-app/jest.config.js mobile-app/jest.setup.ts
git commit -m "test: add mobile jest harness"
```

## Test Pyramid

The desired shape for pocketED is:

- Many unit tests for calculation functions, reducers, service error handling,
  and validation helpers.
- A solid integration suite for the backend HTTP API and important mobile
  component interactions.
- A smaller but meaningful Maestro acceptance suite that proves the user stories
  work on a real Android runtime.

Recommended ratio:

- 60 percent unit tests.
- 30 percent integration tests.
- 10 percent acceptance tests.

## Deferred Backend Unit Test Plan

Do not implement this section during the first testing pass. Keep the backend
unchanged until the mobile UI automation work is complete or the team explicitly
decides to spend remaining time on backend coverage.

### Backend Test Project

Create:

```text
backend/PocketED.Api.Tests/
  PocketED.Api.Tests.csproj
  Unit/
  Integration/
  TestSupport/
```

Recommended packages:

- `xunit`
- `xunit.runner.visualstudio`
- `Microsoft.NET.Test.Sdk`
- `Microsoft.AspNetCore.Mvc.Testing`
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.Data.Sqlite`
- `FluentAssertions`

Add the test project to the solution:

```bash
dotnet new xunit -o backend/PocketED.Api.Tests
dotnet add backend/PocketED.Api.Tests reference backend/PocketED.Api
dotnet sln T1.sln add backend/PocketED.Api.Tests
```

### Production Changes Needed For Testability

Make the smallest production changes possible:

- Add `public partial class Program { }` at the end of `Program.cs` so
  `WebApplicationFactory<Program>` can boot the API.
- Move the SQLite connection string to configuration:

```csharp
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=pocketed.db";
```

- Keep the default behavior unchanged for development.
- Override the database only inside integration tests.

### Unit Test Targets

Current backend logic mostly lives in controllers, so the first useful tests are
controller-level tests with a real isolated DbContext. As the backend grows,
extract small policies or validators and unit-test those directly.

Test files to create:

```text
backend/PocketED.Api.Tests/Unit/AppDbContextModelTests.cs
backend/PocketED.Api.Tests/Unit/BudgetRulesTests.cs
backend/PocketED.Api.Tests/Unit/UserRequestValidationTests.cs
```

Coverage targets:

- `AppDbContext` creates keys for `User`, `Expense`, and `Budget`.
- `User.Email` uniqueness is enforced.
- User to expenses relationship persists correctly.
- User to budgets relationship persists correctly.
- Budget uniqueness rule is documented and enforced through API behavior:
  same user plus same category plus same period updates the existing budget.
- Invalid or missing user IDs return `404`.
- Negative amount behavior is intentionally decided and documented. The current
  mobile app represents income as a negative expense, so tests must protect that
  convention unless the model changes.

## Deferred Backend Integration Test Plan

Do not implement this section during the first testing pass. It is kept here so
the eventual backend test work has a precise path when backend changes become
allowed.

Use `WebApplicationFactory<Program>` and SQLite in-memory mode. Prefer SQLite
over EF InMemory because SQLite catches relational behavior and uniqueness
constraints more realistically.

Create:

```text
backend/PocketED.Api.Tests/TestSupport/PocketEdApiFactory.cs
backend/PocketED.Api.Tests/Integration/UsersApiTests.cs
backend/PocketED.Api.Tests/Integration/ExpensesApiTests.cs
backend/PocketED.Api.Tests/Integration/BudgetsApiTests.cs
backend/PocketED.Api.Tests/Integration/UserAccountSnapshotTests.cs
```

### Required Backend Integration Scenarios

Users:

- Register returns `201 Created`.
- Register response includes `id` and `email`.
- Register persists `name`, `email`, and password for prototype behavior.
- Register duplicate email returns `409 Conflict`.
- Login with correct credentials returns `200 OK`.
- Login with wrong password returns `401 Unauthorized`.
- Login with unknown email returns `401 Unauthorized`.
- Get account for an existing user returns user profile plus empty expenses and
  budgets.
- Get account for an unknown ID returns `404 Not Found`.

Expenses:

- Add expense for an existing user returns `201 Created`.
- Add expense persists title, amount, category, date, and user relationship.
- Add expense for unknown user returns `404 Not Found`.
- Account snapshot includes newly added expenses.
- Multiple expenses for one user do not appear in another user's account.
- Negative amount is accepted only if the team keeps the current income model.

Budgets:

- Add budget for an existing user returns `201 Created`.
- Add budget persists category, limit, period, and user relationship.
- Add budget for unknown user returns `404 Not Found`.
- Posting same category and period for same user updates the existing limit.
- Posting same category and different period creates a separate budget.
- Posting same category and period for a different user creates a separate
  budget.
- Account snapshot includes current budget values.

Error and contract behavior:

- Malformed JSON returns `400 Bad Request`.
- Missing required JSON properties return the chosen behavior. If the app keeps
  non-nullable records only, document the default ASP.NET behavior. If explicit
  validation is added, assert the custom error messages.
- Response JSON shapes stay stable for the mobile app:
  `id`, `email`, `name`, `expenses`, `budgets`, `title`, `amount`, `category`,
  `date`, `limit`, and `period`.

## Mobile Unit Test Plan

### Mobile Test Harness

Add Jest with Expo support:

```bash
cd mobile-app
npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native react-test-renderer
```

Add scripts to `mobile-app/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest src --runInBand"
  }
}
```

Add:

```text
mobile-app/jest.config.js
mobile-app/jest.setup.ts
mobile-app/__mocks__/
```

Jest config outline:

```js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.style.ts",
    "!src/resources/**"
  ]
};
```

### Mobile Unit Test Targets

Auth reducer:

```text
mobile-app/src/context/__tests__/authReducer.test.ts
```

Scenarios:

- Initial state is unauthenticated.
- `LOGIN` sets `isAuthenticated` to true and stores the user.
- `LOGOUT` clears the user and sets `isAuthenticated` to false.
- State objects are replaced predictably.

Expense service:

```text
mobile-app/src/services/__tests__/expenseService.test.ts
```

Scenarios:

- `calculateSummary([])` returns zero income, spent, and balance.
- Positive amounts count as spent.
- Negative amounts count as income.
- Mixed income and expenses produce correct balance.
- Decimal values are preserved.
- `addExpense` sends a positive absolute amount even if the input amount is
  negative.
- `addIncome` sends a negative absolute amount.
- `getUserData` returns empty arrays if backend fields are not arrays.
- `getUserData`, `addExpense`, and `addIncome` throw on non-OK HTTP responses.

Auth service:

```text
mobile-app/src/services/__tests__/authService.test.ts
```

Scenarios:

- `registerUser` posts name, email, and password.
- `registerUser` fetches the full user after registration.
- `registerUser` stores the current user in AsyncStorage.
- `registerUser` throws when registration fails.
- `loginUser` posts email and password.
- `loginUser` fetches the full user after login.
- `loginUser` stores the current user in AsyncStorage.
- `loginUser` throws on invalid credentials.
- `getCurrentUser` returns null when storage is empty.
- `getCurrentUser` parses stored JSON.
- `clearCurrentUser` removes `current_user`.

Dashboard utilities:

- Extract `formatCurrency`, `formatDate`, `getGreeting`, and category/budget
  calculations from `DashboardScreen.tsx` into a small utility file.
- Unit-test currency formatting, invalid date fallback, greeting boundaries,
  category spending totals, budget progress percent, and color thresholds.

Recommended file:

```text
mobile-app/src/screens/DashboardScreen/dashboardUtils.ts
mobile-app/src/screens/DashboardScreen/__tests__/dashboardUtils.test.ts
```

## Mobile Component Integration Test Plan

Use React Native Testing Library with mocked router, AsyncStorage, API services,
and AuthContext where needed.

Create:

```text
mobile-app/src/screens/WelcomeScreen/__tests__/WelcomeScreen.test.tsx
mobile-app/src/screens/LoginScreen/__tests__/LoginScreen.test.tsx
mobile-app/src/screens/RegisterScreen/__tests__/RegisterScreen.test.tsx
mobile-app/src/screens/DashboardScreen/__tests__/DashboardScreen.test.tsx
mobile-app/src/screens/AddExpenseScreen/__tests__/AddExpenseScreen.test.tsx
mobile-app/src/screens/AddIncomeScreen/__tests__/AddIncomeScreen.test.tsx
mobile-app/src/screens/AddBudgetScreen/__tests__/AddBudgetScreen.test.tsx
mobile-app/src/screens/UserProfileScreen/__tests__/UserProfileScreen.test.tsx
```

Scenarios:

- Welcome renders register, login, and guest actions.
- Welcome register button routes to `/auth/register`.
- Welcome login button routes to `/auth/login`.
- Welcome guest button routes to `/(tabs)`.
- Login blocks empty email or password and shows an alert.
- Login calls `loginUser`, updates `AuthContext`, and routes to `/(tabs)`.
- Login failed response shows an error alert.
- Register blocks missing fields.
- Register blocks mismatched passwords.
- Register calls `registerUser` and routes to login with email param.
- Dashboard renders empty state when there are no transactions.
- Dashboard renders income, spent, balance, remaining, recent transactions, and
  budget overview from mocked API data.
- Dashboard logout clears current user, updates context, and routes to login.
- Add expense validates title, amount, and category.
- Add expense sends the expected POST body.
- Add income validates title and amount.
- Add income sends negative amount through `addIncome`.
- Add budget validates category and limit.
- Add budget sends period `monthly`.
- Profile renders user name, email, summary values, and sign-out behavior.

## Mobile Testability Improvements

Add stable selectors before relying on component and Maestro tests:

- `welcome-register-button`
- `welcome-login-button`
- `welcome-guest-button`
- `login-email-input`
- `login-password-input`
- `login-submit-button`
- `register-name-input`
- `register-email-input`
- `register-password-input`
- `register-confirm-password-input`
- `register-submit-button`
- `dashboard-balance-value`
- `dashboard-income-value`
- `dashboard-spent-value`
- `dashboard-remaining-value`
- `dashboard-add-income-button`
- `dashboard-add-expense-button`
- `dashboard-add-budget-button`
- `expense-title-input`
- `expense-amount-input`
- `expense-category-input`
- `expense-save-button`
- `income-title-input`
- `income-amount-input`
- `income-save-button`
- `budget-category-input`
- `budget-limit-input`
- `budget-save-button`
- `profile-sign-out-button`

Use `accessibilityLabel` when the selector also improves real accessibility.
Use `testID` when the selector is only for automation.

## API Configuration Plan For Tests

Centralize the API base URL:

```text
mobile-app/src/services/api.ts
```

Recommended behavior:

- Default to the current remote API for development if the team still needs it.
- Allow `EXPO_PUBLIC_API_BASE_URL` to override the URL.
- Import `BASE_URL` from one file everywhere.
- Remove the duplicate constant in `expenseService.ts`.

Test benefit:

- Unit tests can mock `BASE_URL` or fetch behavior consistently.
- Maestro can run against a local test API instead of the shared public server.
- CI does not depend on `91.98.197.3`.

## Maestro Acceptance Test Plan

### App ID

The Android package in `app.json` is:

```text
com.pocketed.app
```

For a development build, Maestro flows should use:

```yaml
appId: com.pocketed.app
```

If the team keeps using Expo Go instead of a development build, app launching is
different and the flows need a separate Expo Go launch strategy. The stable
long-term path is a development build with `com.pocketed.app`.

### Maestro File Layout

Use a numbered suite so flow order is clear:

```text
mobile-app/.maestro/
  README.md
  00_smoke_welcome.yaml
  01_auth_register_login.yaml
  02_add_income_record.yaml
  03_add_expense_record.yaml
  04_set_monthly_budget.yaml
  05_categorize_expenses.yaml
  06_view_remaining_balance.yaml
  07_view_financial_statistics.yaml
  08_profile_logout_session.yaml
  setup/
    seed_user.yaml
```

Existing files can be migrated into this naming scheme once selectors are
stable.

### Acceptance Flow Details

Smoke welcome:

- Launch app with clear state.
- Assert pocketED brand appears.
- Assert register, login, and guest actions appear.
- Tap login and return to welcome.
- Tap register and return to welcome.

Auth register/login:

- Launch app with clear state.
- Open register.
- Fill unique name, email, password, and confirm password.
- Submit registration.
- Assert login screen opens with the email prefilled.
- Fill password.
- Submit login.
- Assert dashboard appears.
- Assert user initials or profile name matches the registered user.

Add income record:

- Start from a logged-in user.
- Open dashboard.
- Tap `Income`.
- Fill title and amount.
- Save.
- Assert dashboard shows the new income in recent transactions.
- Assert income total increased.
- Assert balance increased.

Add expense record:

- Start from a logged-in user.
- Open dashboard.
- Tap `Expense`.
- Fill title, amount, and category.
- Save.
- Assert dashboard shows the new expense in recent transactions.
- Assert spent total increased.
- Assert balance decreased.

Set monthly budget:

- Start from a logged-in user.
- Tap `Budget`.
- Fill category and limit.
- Save.
- Assert budget overview includes the category.
- Assert total budget increased.
- Add a second budget for same category and period.
- Assert the category is updated, not duplicated.

Categorize expenses:

- Start from a logged-in user with at least two expenses in different
  categories.
- Assert recent transactions show category metadata.
- Assert budget overview groups spending by category.
- Add a new expense in a new category.
- Assert the new category appears in the relevant dashboard sections.

View remaining balance:

- Seed or create known income, expense, and budget values.
- Assert income total.
- Assert spent total.
- Assert balance.
- Assert remaining budget.
- Add an expense that pushes spending near 80 percent of budget and assert the
  warning state if exposed in UI.
- Add an expense that pushes spending over budget and assert the over-budget
  state if exposed in UI.

View financial statistics:

- Seed or create multiple income and expense records.
- Assert dashboard summary values.
- Assert recent transaction list.
- Assert budget progress percentage.
- Assert profile financial summary matches dashboard values.

Profile logout/session:

- Start logged in.
- Open profile.
- Assert name and email.
- Assert income, spent, and balance.
- Tap sign out.
- Assert login screen appears.
- Relaunch app.
- Assert the user is not still authenticated.

### Maestro Data Strategy

Avoid shared mutable data on the public API. Choose one of these options:

- Preferred: local backend in `Testing` environment with a fresh SQLite database
  per run.
- Good: test-only reset endpoint enabled only when
  `ASPNETCORE_ENVIRONMENT=Testing`.
- Acceptable for early work: unique email and unique transaction names per run,
  using timestamps or Maestro environment variables.

Do not use real personal or financial data in acceptance tests.

### Maestro Commands

From `mobile-app`:

```bash
npm install
npx expo start --android
```

In another terminal:

```bash
maestro test .maestro
```

From WSL with Windows ADB:

```bash
./scripts/maestro-wsl.sh .maestro
```

Run one flow:

```bash
./scripts/maestro-wsl.sh .maestro/01_auth_register_login.yaml
```

## User Story Coverage Matrix

| User Story | Unit Tests | Integration Tests | Maestro Acceptance |
| --- | --- | --- | --- |
| Set Monthly Budget | budget helper and form validation tests | deferred | `04_set_monthly_budget.yaml` |
| Add Expense Record | `addExpense`, form validation, summary calc | deferred | `03_add_expense_record.yaml` |
| Add Income Record | `addIncome`, negative amount convention, summary calc | deferred | `02_add_income_record.yaml` |
| Categorize Expenses | category spending helper | deferred | `05_categorize_expenses.yaml` |
| View Remaining Balance | `calculateSummary`, remaining budget helper | deferred | `06_view_remaining_balance.yaml` |
| View Financial Statistics | dashboard/profile summary helpers | deferred | `07_view_financial_statistics.yaml` |
| Register/Login | `authReducer`, `authService`, storage helpers | deferred | `01_auth_register_login.yaml` |
| Session/Profile/Logout | context and storage tests | deferred | `08_profile_logout_session.yaml` |

## Continuous Integration Plan

Add CI after the first mobile unit/component tests exist.

Recommended jobs:

- Mobile:
  - Install Node.
  - Run `npm ci` in `mobile-app`.
  - Run `npm run lint`.
  - Run `npm test -- --runInBand`.
- Backend:
  - Deferred until backend tests are allowed.
- Acceptance:
  - Keep Maestro as a manual or nightly job unless the team has a reliable
    Android emulator environment in CI.

## Definition Of Done For New Features

A feature is not done until:

- Unit tests cover new calculations, reducers, validators, and service behavior.
- Integration tests cover new or changed API contracts.
- At least one Maestro flow covers the user-visible journey when the feature is
  tied to a user story.
- Any bug fix includes a regression test at the lowest useful layer.
- README or this testing plan is updated if commands, setup, or strategy change.
- Tests are deterministic and do not depend on the shared public API unless the
  test is explicitly marked as manual.

## First Implementation Order

1. Commit this documentation.
2. Add stable selectors to mobile screens.
3. Rewrite Maestro flows to use current UI text, `com.pocketed.app`, and stable
   selectors.
4. Centralize the mobile API base URL without changing backend code.
5. Add Jest, React Native Testing Library, and AsyncStorage/fetch mocks.
6. Add unit tests for `authReducer`, `authService`, and `expenseService`.
7. Extract dashboard helpers and test them.
8. Add mobile screen/component tests.
9. Add CI for mobile lint and mobile tests.
10. Revisit backend tests only if time remains and backend changes are allowed.

## Known Risks To Track

- `npm run lint` started but did not finish in the sandboxed shell and had to be
  stopped. Re-run it in a normal development terminal before treating lint as
  verified.
- The public API URL makes tests dependent on external state. Move to local test
  configuration before writing reliable integration or acceptance tests.
- Existing Maestro placeholder flows may fail against the current UI. Treat them
  as drafts until selectors and expected values are updated.
- The app contains both `/auth/login` and top-level `/login` route wrappers.
  Tests should focus on the routes actually used by navigation.
- Backend test work is deliberately postponed; do not add backend projects,
  backend config changes, or backend test helpers in the UI-first phase.
