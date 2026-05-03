# pocketED Maestro Acceptance Suite

End-to-end flows that verify each user story on a real Android device or emulator.

## Prerequisites

- Android device or emulator connected and recognised by `adb devices`
- A pocketED development build installed (`com.pocketed.app`)
- Backend running and reachable from the device
- [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) installed

## Running the suite

From `mobile-app/`:

```bash
# All flows
maestro test .maestro

# Single flow
maestro test .maestro/01_auth_register_login.yaml

# From WSL with Windows ADB
./scripts/maestro-wsl.sh .maestro
./scripts/maestro-wsl.sh .maestro/01_auth_register_login.yaml
```

## Environment variables

The `setup/seed_user.yaml` subflow accepts overrides so each run can use a
unique account (important when running against a persistent backend):

```bash
maestro \
  -e USER_NAME="Alice" \
  -e USER_EMAIL="alice+$(date +%s)@example.com" \
  -e USER_PASSWORD="secret123" \
  test .maestro/01_auth_register_login.yaml
```

| Variable        | Default              | Purpose                        |
|-----------------|----------------------|--------------------------------|
| `USER_NAME`     | `Maestro Tester`     | Display name for registration  |
| `USER_EMAIL`    | `maestro@example.com`| Account email                  |
| `USER_PASSWORD` | `secret123`          | Account password               |

## Flow index

| File | Tag | User story covered |
|------|-----|--------------------|
| `00_smoke_welcome.yaml` | `smoke` | Welcome screen navigation |
| `01_auth_register_login.yaml` | `acceptance` | Register and login |
| `02_add_income_record.yaml` | `acceptance` | Add income record |
| `03_add_expense_record.yaml` | `acceptance` | Add expense record |
| `04_set_monthly_budget.yaml` | `acceptance` | Set monthly budget |
| `05_categorize_expenses.yaml` | `acceptance` | Categorize expenses |
| `06_view_remaining_balance.yaml` | `acceptance` | View remaining balance |
| `07_view_financial_statistics.yaml` | `acceptance` | View financial statistics |
| `08_profile_logout_session.yaml` | `acceptance` | Profile, logout, session |
| `setup/seed_user.yaml` | `setup` | Reusable register + login subflow |

## Selectors

All flows use stable `testID` selectors. The full selector list is documented in
[`../resources/testing/testing-plan.md`](../resources/testing/testing-plan.md).
