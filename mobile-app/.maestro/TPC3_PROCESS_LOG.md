# TPC#3 Process Log

## Goal

Create one automated acceptance test for the Pocket4Students mobile app using a
tool that fits the current Expo / React Native stack.

## Selected Scenario

**Scenario name:** Guest dashboard flow

**User story**

As a student who does not want to register yet,
I want to continue as a guest,
so that I can immediately view the dashboard and check my spending summary.

**Acceptance criteria**

1. Given the app is launched, when the welcome screen loads, then `Continue as guest` is visible.
2. Given the welcome screen is visible, when the user taps `Continue as guest`, then the dashboard opens.
3. Given the dashboard is open, then the monthly summary is visible.
4. Given the dashboard is open, then recent transactions such as `Grocery Run` and `Bus Pass` are visible.
5. Given the user scrolls down, then the `Budget Overview` section and budget categories are visible.


## Tools Considered

- `Maestro`: selected because it works well with Expo / React Native, uses readable YAML, and is fast to set up.
- `Detox`: powerful, but heavier to configure for a single scenario and less convenient with Expo Go.
- `Patrol`: not applicable because this project is not Flutter.
- `Jest` with component tests: useful for UI units, but not a real device-level acceptance test.

## Files Produced

- [`guest_dashboard.yaml`](/C:/Users/filip/Desktop/feup/ES/ESOF26/T1/mobile-app/.maestro/guest_dashboard.yaml): authoritative acceptance flow used for TPC#3.
- [`README.md`](/C:/Users/filip/Desktop/feup/ES/ESOF26/T1/mobile-app/.maestro/README.md): run guide and scenario summary.
- [`TPC3_PROCESS_LOG.md`](/C:/Users/filip/Desktop/feup/ES/ESOF26/T1/mobile-app/.maestro/TPC3_PROCESS_LOG.md): this process log.

## Commands Used

```bash
git switch -c FilipeCamacho-tpc3
cd mobile-app
npm install
npx expo start --android
maestro test .maestro/guest_dashboard.yaml
maestro record .maestro/guest_dashboard.yaml
```

If using WSL with a Windows Android SDK:

```bash
bash ./scripts/maestro-wsl.sh .maestro/guest_dashboard.yaml
```

## Prompts / Inputs Used

Example planning prompt:

> Analyze the whole repo first,and help me prepare my own automated acceptance test for a guest dashboard flow.

## Expected Output

- The app launches in Expo Go.
- The welcome screen appears.
- The script taps `Continue as guest`.
- The dashboard becomes visible.
- Maestro validates dashboard content and finishes successfully.

## Critical Analysis

### What went well

- The guest dashboard journey is already implemented and easy to validate from the user perspective.
- Maestro expresses acceptance criteria in a readable way, close to natural language.
- The dashboard uses fixed mock values, which keeps assertions deterministic.

### Difficulties

- The current branch does not define an Android package name, so the test must target Expo Go with `host.exp.exponent`.
- The local environment used for this task did not have the `maestro` CLI installed, so final execution still needs to happen on a prepared machine.
- Some existing draft flows in `.maestro` describe future scenarios that are not yet implemented in the app.

### Improvements for the future

- Add `testID` attributes to the most important elements to make selectors less dependent on UI text.
- Add a standalone Android package or development build so Maestro can target the app directly instead of Expo Go.
- Integrate the acceptance test into CI once the mobile runtime setup is stable.

## References

- [Maestro docs](https://maestro.mobile.dev/)
- [Expo docs](https://docs.expo.dev/)
- [Android emulator setup](https://developer.android.com/studio/run/managing-avds)
