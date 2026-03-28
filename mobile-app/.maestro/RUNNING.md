# TPC#3 — Acceptance Test: Running Guide & Log Context

This document covers everything needed to:
1. Run the Maestro acceptance test on an Android emulator (from a non-ARM machine)
2. Record the video deliverable
3. Write the TPC#3 process log document

---

## Background

**App:** pocketED (Pocket4Students) — a React Native / Expo mobile app for student expense tracking.
**Branch:** `RafaelIssa-tpc3`
**Test file:** `mobile-app/.maestro/flows/guest_dashboard.yaml`
**Scenario tested:** Guest user navigates from Welcome screen to Dashboard and views their financial summary.

---

## Section 1 — Prerequisites

Install these on a **non-ARM (x86_64) machine** (e.g. an Intel/AMD Linux, macOS, or Windows machine):

| Tool | Version | Install |
|------|---------|---------|
| Java (JDK) | 17+ | `sudo apt install openjdk-17-jdk` (Linux) or [Adoptium](https://adoptium.net/) |
| Android Studio | latest | [developer.android.com/studio](https://developer.android.com/studio) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) or `nvm install 18` |
| Expo CLI | latest | `npm install -g expo-cli` |
| Maestro CLI | latest | `curl -Ls "https://get.maestro.mobile.dev" \| bash` |

After installing Maestro, verify it works:
```bash
maestro --version
```

---

## Section 2 — Set Up the Android Emulator

> **Why a non-ARM machine?** The original development machine (ARM-based, Debian 13) cannot run the Android emulator because Android x86_64 images require hardware virtualisation (KVM/HAXM) which is unavailable on ARM hosts without nested virtualisation.

### Steps

1. Open **Android Studio** → **Device Manager** (right toolbar or `Tools > Device Manager`)
2. Click **Create Device**
3. Select **Pixel 8** → **Next**
4. Select system image: **API 34** (x86_64, Android 14) → **Download** if needed → **Next**
5. Click **Finish**
6. Start the emulator:
   ```bash
   # macOS/Linux: find the emulator binary
   $ANDROID_HOME/emulator/emulator -avd Pixel_8_API_34
   # or simply press ▶ in Device Manager
   ```

Verify the device is online:
```bash
adb devices
# Should show: emulator-5554  device
```

---

## Section 3 — Run the App

```bash
# 1. Clone the repo (if not already done)
git clone https://github.com/LEIC-ES-2025-26-2LEIC12/T1.git
cd T1

# 2. Switch to the TPC#3 branch
git checkout RafaelIssa-tpc3

# 3. Install dependencies
cd mobile-app
npm install

# 4. Start Expo and open on the Android emulator
npx expo start --android
```

Expo will install **Expo Go** on the emulator automatically and open the app.
Wait for the Metro bundler to finish (the app should appear on screen).

---

## Section 4 — Run the Acceptance Test

Open a **second terminal** (keep Expo running in the first one):

```bash
cd T1/mobile-app

# Run the test (pass/fail output in terminal)
maestro test .maestro/flows/guest_dashboard.yaml
```

Expected output — all assertions pass:
```
✅  assertVisible: "Get Started"
✅  assertVisible: "Continue as guest"
✅  tapOn: "Continue as guest"
✅  assertVisible: "Spent this month"
✅  assertVisible: "$748.50"
✅  assertVisible: "of $1,200.00 budget"
✅  assertVisible: "Recent Transactions"
✅  assertVisible: "Grocery Run"
✅  assertVisible: "Bus Pass"
✅  scrollUntilVisible: "Budget Overview"
✅  assertVisible: "Food & Dining"
✅  assertVisible: "Transport"

Flow completed successfully
```

If a step fails, Maestro prints the failing assertion and a screenshot. Common causes:
- App not fully loaded yet → re-run (Maestro retries for a few seconds by default)
- Currency format mismatch (e.g. `$1,200.00` vs `$1200.00`) → check `DashboardScreen.tsx` `formatCurrency()` output

---

## Section 5 — Record the Video

**Option A — Maestro built-in recorder:**
```bash
maestro record .maestro/flows/guest_dashboard.yaml
# Produces a .mp4 in the current directory
```

**Option B — Android emulator built-in recorder:**
- In the emulator toolbar: click the camera icon → **Record and Playback** → **Start Recording**
- Run `maestro test ...` in the terminal
- Stop recording → **Save**

---

## Section 6 — Context for Writing the TPC#3 Log Document

The assignment requires a personal log documenting all goals, commands, prompts, inputs, outputs, links, and a critical analysis. Use this section as a scaffold.

### 6.1 — Assignment Goals

> Automated acceptance tests help agile teams verify that delivered features match stakeholder expectations. They reduce manual testing effort, enable fast feedback, and protect against regressions. This individual assignment explores automating one acceptance test scenario for the pocketED app.

### 6.2 — Scenario Specification

**User story:**
*As a student who does not want to create an account, I want to tap "Continue as guest" so that I can immediately see my financial dashboard without registering.*

**Acceptance criteria:**
| # | Given | When | Then |
|---|-------|------|------|
| 1 | App is launched | Welcome screen loads | "Continue as guest" button is visible |
| 2 | Welcome screen is shown | User taps "Continue as guest" | Dashboard screen opens |
| 3 | Dashboard screen is open | — | "Spent this month" budget summary is visible |
| 4 | Dashboard screen is open | — | "Grocery Run" appears in Recent Transactions |
| 5 | Dashboard screen is open | User scrolls down | "Food & Dining" appears in Budget Overview |

### 6.3 — Tool Research & Rationale

Tools evaluated:

| Tool | Notes | Decision |
|------|-------|----------|
| **Maestro** | YAML-based mobile E2E testing, Expo/React Native support, one-line install, produces video | ✅ **Chosen** |
| **Patrol** | Flutter-specific, not compatible with React Native | ❌ Not applicable |
| **Detox** | Powerful but complex setup (native build required, no Expo Go support) | ❌ Overhead too high for 1 test |
| **Jest + RNTL** | Component-level, no real device, no video | ❌ Not a true E2E acceptance test |
| **Selenium** | Web-focused, poor mobile support | ❌ Not applicable |

Maestro was selected because: zero NPM deps, human-readable YAML aligns with acceptance test semantics (BDD-style), text-based element targeting requires zero source code changes, and `maestro record` produces the required video deliverable.

### 6.4 — Commands Log

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash
maestro --version

# Create branch
git checkout -b RafaelIssa-tpc3

# Run test
maestro test .maestro/flows/guest_dashboard.yaml

# Record video
maestro record .maestro/flows/guest_dashboard.yaml

# Commit
git add .maestro/
git commit -m "feat: add Maestro acceptance test for guest dashboard flow (TPC#3)"
git push -u origin RafaelIssa-tpc3
```

### 6.5 — AI Assistance Log

**Tool used:** Claude Code (claude-sonnet-4-6) via CLI

**Prompt given:**
> "Based on the current project, sketch out and prepare to complete the tasks described below: [assignment text about automated acceptance tests]"

**What Claude produced:**
- Explored the entire codebase (screens, navigation, services, models, theme, package.json)
- Identified the guest dashboard flow as the best single scenario (already fully functional end-to-end)
- Chose Maestro over alternatives with explicit rationale
- Generated `guest_dashboard.yaml` with text-based assertions derived from reading the actual component source
- Generated this `RUNNING.md` document
- Created the git branch and committed the files

**Key AI decisions to reflect on:**
- Chose text-based targeting (`assertVisible: "Grocery Run"`) over `testID` attributes — avoids source code changes but couples tests to copy text
- Chose Expo Go (`appId: host.exp.exponent`) over a standalone build — simpler setup but requires Expo Go installed on emulator

### 6.6 — Critical Analysis

**What worked well:**
- Maestro's text-based targeting let us write the entire test without touching any app source code
- The scenario (guest flow) is a clean, linear path with no auth state — ideal for a first acceptance test
- YAML syntax makes the test readable as a specification (mirrors the acceptance criteria table directly)

**Limitations & challenges:**
- **ARM incompatibility:** The development machine (ARM-based Debian 13) cannot run the Android emulator, requiring the test to be run on a separate x86_64 machine. This breaks the "run your own tests" developer loop.
- **Expo Go dependency:** `host.exp.exponent` as the `appId` means the test only works while the app is open in Expo Go. A production scenario would need a standalone build with a proper bundle ID.
- **Text coupling:** If the UI copy changes (e.g. "$748.50" is recalculated), the test will fail even though the feature works correctly. Adding `testID` attributes to key components would make the test more robust.
- **Mock data dependency:** The test assertions are tied to hardcoded mock values in `DashboardScreen.tsx`. If the data layer is swapped for a real backend, assertions must be updated.
- **No CI integration:** The test runs manually. A future improvement would be adding a GitHub Actions workflow to run Maestro tests on every PR (using a hosted emulator via `reactivecircus/android-emulator-runner`).

**Overall assessment:** For a single-scenario TPC#3 assignment, Maestro provides an excellent balance of simplicity and capability. The resulting test is readable, requires no build tooling, and produces a video. The ARM machine limitation is a real-world constraint that highlights the importance of CI infrastructure for mobile testing.

---

## Links & Resources

- [Maestro documentation](https://maestro.mobile.dev/)
- [Maestro + Expo guide](https://maestro.mobile.dev/platform-support/react-native)
- [Android Studio AVD Manager](https://developer.android.com/studio/run/managing-avds)
- [GitHub Actions Android emulator](https://github.com/ReactiveCircus/android-emulator-runner)
- pocketED repo: `https://github.com/LEIC-ES-2025-26-2LEIC12/T1`
