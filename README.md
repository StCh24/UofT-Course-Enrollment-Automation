# UofT ACORN Tampermonkey Automation Scripts

This repository contains two userscripts:

1. **Login Redirect Script** – auto-fills the UofT SSO login form and redirects to the ACORN course page.
2. **Auto Enrol Script** – injects a helper button into ACORN and opens one worker window per course to repeatedly attempt enrollment.
---

## What Each Script Does

### 1) `scripts/utoronto-login-redirect.user.js`

This is the **entry script**.

It performs two actions:

- Detects the UofT SSO login page.
- Fills in the username and password fields, then submits the login form.
- If the browser lands on the ACORN home page (`#/`), it redirects to the course page (`#/courses/0`).

This script automates the transition from **login** to the **course management page**.


### 2) `scripts/utoronto-auto-enrol.user.js`

This is the **main automation script**.

It performs three actions:

- Injects a fixed `GOGOGO` button into the ACORN course page.
- Opens one new browser window per course listed in `preferredCourses`.
- In each worker window, waits for the course card and enrol button to appear, then repeatedly clicks **Enrol**.

This script automates the transition from **course page** to **multi-course enrol attempts**.


### 3) `config/*.options.json`

These files are exported Tampermonkey configuration files.

They store metadata such as:

- URL match rules
- execution timing
- whether the script is enabled
- Tampermonkey panel position


### 4) `config/*.storage.json`

These files are exported Tampermonkey storage files.

In this package, they are effectively empty placeholders and contain no important runtime data.

---

## Workflow

### A. Login and redirect flow

1. Open the UofT login page.
2. The login script detects the login submit button.
3. The script fills the username and password inputs.
4. The script clicks the submit button.
5. After login, if the browser lands on `https://acorn.utoronto.ca/sws/#/`, the script redirects to `https://acorn.utoronto.ca/sws/#/courses/0`.

### B. Auto-enrol flow

1. Open the ACORN course page.
2. The auto-enrol script injects a `GOGOGO` button.
3. Click the button.
4. The script loops through `preferredCourses`.
5. For each course, it opens a new window:

```text
https://acorn.utoronto.ca/sws/#/courses/0?_=CSC108H1
```

6. Each worker window:
   - waits for the course card to render
   - clicks `.updateEnrolment`
   - waits for `#enrolFromPlan`
   - removes the `disabled` class
   - clicks the button up to `MAX_REPEAT` times with `THINK_TIME` delay between attempts

---

## Configuration

### In `scripts/utoronto-login-redirect.user.js`

```javascript
let username = "your UTORid",
    password = "the corresponding password";
```

Replace these placeholders



### In `scripts/utoronto-auto-enrol.user.js`

```javascript
const preferredCourses = [
    "CSC148H1",
    "ECO101H1",
    "MAT135H1",
    "MAT223H1",
    "STA130H1",
],
THINK_TIME = 3000,
MAX_REPEAT = 2,
BASE_URL = "https://acorn.utoronto.ca/sws/#/courses/0";
```

- `preferredCourses`: list of target course IDs

Replace these courses IDs
You must have already added these courses to your enrollment cart


---

## Installation

### Prerequisites

- Google Chrome or Microsoft Edge
- [Tampermonkey](https://www.tampermonkey.net/)

### Install steps

1. Install Tampermonkey in your browser.
2. Import the two `.user.js` files from the `scripts/` folder.
3. Optionally import the `.json` config files if you want to preserve the original Tampermonkey metadata.
4. Edit the placeholders and course list locally.
5. Make sure both scripts are enabled in Tampermonkey.

---

## Usage

1. Open the UofT SSO / ACORN login page.
2. The login script auto-fills the credentials and submits the form.
3. After redirecting to the course page, the auto-enroll script adds the `GOGOGO` button.
4. Click `GOGOGO`.
5. The browser opens one window per course and starts the enroll workflow.


---

## Disclaimer

This repository is provided for code review, documentation, and educational inspection of the original automation logic. Use it at your own risk. The user is responsible for compliance, account safety, and any consequences of running browser automation on university systems.
