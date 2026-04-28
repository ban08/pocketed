# pocketED Maestro Acceptance Tests

This folder contains the Android acceptance-test suite for pocketED. The current
YAML files are a starting point and should be treated as drafts until the app has
stable `testID` or accessibility selectors and deterministic test data.

For the complete testing roadmap, see:

```text
../../resources/testing/testing-plan.md
```

## Target App

The Android package configured in `mobile-app/app.json` is:

```text
com.pocketed.app
```

Maestro flows should use this app ID when running against a development build:

```yaml
appId: com.pocketed.app
```

If the team runs the app through Expo Go, the launch strategy is different and
the flows may need temporary Expo Go-specific setup. The recommended long-term
path is a development build using `com.pocketed.app`.

## Planned Flow Suite

The final suite should cover one user-story-sized journey per file:

- `00_smoke_welcome.yaml`: welcome screen and navigation entry points.
- `01_auth_register_login.yaml`: account creation, login, and dashboard entry.
- `02_add_income_record.yaml`: add income and verify summary changes.
- `03_add_expense_record.yaml`: add expense and verify transaction plus totals.
- `04_set_monthly_budget.yaml`: create or update a monthly budget.
- `05_categorize_expenses.yaml`: verify category metadata and budget grouping.
- `06_view_remaining_balance.yaml`: verify balance and remaining budget.
- `07_view_financial_statistics.yaml`: verify dashboard/profile summaries.
- `08_profile_logout_session.yaml`: profile information, logout, and relaunch.

## Running From WSL

The helper script proxies Windows `adb.exe` so Maestro can run from WSL:

```bash
cd mobile-app
./scripts/maestro-wsl.sh .maestro
```

Run a single flow:

```bash
./scripts/maestro-wsl.sh .maestro/auth_navigation.yaml
```

## Running Directly

Start the app first:

```bash
cd mobile-app
npx expo start --android
```

Then run Maestro:

```bash
maestro test .maestro
```

## Stabilization Checklist

- Replace placeholder flows with current UI behavior.
- Change `appId` from old placeholder values to `com.pocketed.app`.
- Add stable selectors to the app for every tapped or asserted element.
- Avoid depending on the shared public API; use a local testing backend or
  unique per-run data.
- Keep one acceptance flow per user story so failures are easy to understand.
