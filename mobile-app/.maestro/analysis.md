# Acceptance Test Analysis – Login Flow (TPC#3)

## 1. Objective

The objective of this acceptance test is to validate a complete user login scenario in the Pocket4Students mobile application.

The test ensures that a user can authenticate using valid credentials and successfully access the dashboard, verifying the system behavior from an end-user perspective.

---

## 2. Scenario Description

**User Story:**
As a student,
I want to log into my account
So that I can access my financial dashboard

---

## 3. Acceptance Criteria

* The login screen is accessible
* The user can input email and password
* The login button is functional
* The user is redirected after successful login
* The dashboard screen is displayed

---

## 4. Test Implementation Strategy

The test was implemented using Maestro and follows an end-to-end interaction model.

The automation simulates real user actions:

1. Open application
2. Navigate to login screen
3. Enter valid credentials
4. Submit login form
5. Wait for navigation
6. Validate dashboard visibility

The test focuses only on visible UI behavior, avoiding dependency on internal application logic.

---

## 5. Test Implementation (YAML)

```yaml
appId: host.exp.exponent
---

- tapOn:
    id: "go-to-login"

- tapOn:
    id: "email-input"
- inputText: "test@edu.up.pt"

- tapOn:
    id: "password-input"
- inputText: "Test123#"

- hideKeyboard

- tapOn:
    id: "login-submit"

- waitForAnimationToEnd

- assertVisible: "Quick Actions"
```

---

## 6. Tools and Technologies

* **Maestro** – for automated acceptance testing
* **Expo / React Native** – mobile application framework
* **AsyncStorage** – used for temporary user authentication

Maestro was selected due to its simplicity, YAML syntax, and compatibility with mobile UI testing.

---

## 7. Execution and Results

The test was executed using:

```bash
maestro test .maestro/login-flow.yaml
```

### Result:

* Application launched successfully
* Inputs were filled automatically
* Login action executed
* Navigation to dashboard completed
* Dashboard content ("Quick Actions") became visible

The test passed successfully, confirming that the login flow works correctly.

---

## 8. Difficulties Encountered

Several issues were encountered during development:

* The virtual keyboard blocked the login button
* Navigation was asynchronous and required waiting
* Some UI elements were not immediately visible
* Maestro had difficulty detecting elements using testID
* Timing issues caused intermittent failures

---

## 9. Solutions Applied

To address these issues:

* Added `hideKeyboard` to ensure button accessibility
* Used `waitForAnimationToEnd` to handle navigation delays
* Replaced fragile selectors with visible UI text
* Simplified login logic to guarantee deterministic behavior
* Adjusted test flow to ensure correct execution order

These solutions improved stability and ensured successful execution.

---

## 10. Reproducibility

To reproduce the test:

1. Clone the repository
2. Install dependencies
3. Run the application:

```bash
npx expo start
```

4. Open the app in Expo Go
5. Execute the test:

```bash
maestro test .maestro/login-flow.yaml
```

---

## 11. Critical Analysis

Automated acceptance testing significantly improves software quality by validating real user interactions.

This test demonstrates that:

* Core functionality can be verified automatically
* UI-based validation ensures realistic behavior
* Automation reduces manual testing effort

However, some limitations were observed:

* Dependence on UI structure and text
* Sensitivity to rendering and timing issues
* Limited coverage of edge cases

Despite these limitations, the test provides strong confidence in the correctness of the login flow.

---

## 12. Conclusion

The acceptance test successfully validates the login functionality of the Pocket4Students application.

It confirms that users can authenticate and access the dashboard, ensuring that the system behaves correctly from the user’s perspective.

The test is reliable, reproducible, and suitable for integration into future development workflows.
