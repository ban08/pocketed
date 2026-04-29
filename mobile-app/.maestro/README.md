# pocketED Maestro Acceptance Tests

Acceptance flows that drive the running Android app, one user-story-sized
journey per file. They target stable `testID` selectors that the screens
already expose, so they survive copy and styling changes.

## App ID

The Android package configured in `mobile-app/app.json` is:

```text
com.pocketed.app
```

All flows declare `appId: com.pocketed.app`. Flows are written for a
**development build**. Expo Go has different launch semantics and is not
supported by these flows.

## Layout

```text
.maestro/
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
    seed_user.yaml      # subflow: register a fresh user and land on dashboard
```

`setup/seed_user.yaml` is included by every flow that needs an authenticated
session, via:

```yaml
- runFlow:
    file: setup/seed_user.yaml
```

## Test data

Each run defaults to `maestro@example.com / secret123`. Override per run to
keep the backend clean:

```bash
maestro -e USER_EMAIL="maestro+$(date +%s)@example.com" \
        -e USER_PASSWORD="secret123" \
        -e USER_NAME="Maestro Tester" \
        test .maestro/01_auth_register_login.yaml
```

Most amounts and titles inside individual flows are also exposed as
`env:` blocks at the top of each file — override them the same way.

> **Backend note** — the API in `src/services/api.ts` reads
> `EXPO_PUBLIC_API_BASE_URL`. For Maestro runs against a local backend, start
> the dev build with that variable pointed at your test API to avoid mutating
> the shared public server.

## Running

From `mobile-app/`:

```bash
npm install
npx expo run:android   # build and install the dev client
```

In another terminal:

```bash
maestro test .maestro                  # run the whole suite
maestro test .maestro/00_smoke_welcome.yaml   # run a single flow
```

### From WSL

The helper script proxies Windows `adb.exe` so Maestro can run from WSL:

```bash
./scripts/maestro-wsl.sh .maestro
./scripts/maestro-wsl.sh .maestro/01_auth_register_login.yaml
```

## CI

There is no automated runner yet — Maestro needs an Android emulator job, which
is not part of `mobile-tests.yml`. Run the suite manually before tagging a
release, or wire it into a self-hosted runner with an emulator image.
