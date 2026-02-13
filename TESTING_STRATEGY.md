# Testing Strategy

A professional-grade testing approach for React + TypeScript applications, designed to avoid combinatorial explosion while maintaining comprehensive coverage.

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit Tests** | Vitest | Fast, Vite-native test runner |
| **E2E/BDD** | Playwright + playwright-bdd | Browser automation with Gherkin syntax |
| **Coverage** | Vitest (c8/istanbul) | Code coverage reporting |
| **CI/CD** | GitHub Actions | Automated test runs on PR |

---

## Testing Pyramid

```
                ╱╲
               ╱  ╲
              ╱ E2E ╲         ← Few - CORE data + user journeys
             ╱────────╲
            ╱Integration╲     ← Some - Hook/component interactions
           ╱──────────────╲
          ╱   Unit Tests    ╲  ← Many (123+ tests) - Pure functions
         ╱────────────────────╲
```

**Key Principle:** Push tests DOWN the pyramid wherever possible. E2E tests are slow and brittle - use them only for what unit tests cannot cover.

---

## CORE vs UI Tests (Critical Distinction)

**The form is useless unless it saves data.** This drives our test priority:

### CORE Tests (`@core @critical`)
Test the **value delivered** - data persistence and retrieval:

| Feature | What It Tests | Priority |
|---------|---------------|----------|
| `enquiry-submission.feature` | Form saves to DynamoDB, data retrievable | P0 - MUST PASS |
| `admin-panel.feature` | Admin sees ALL enquiries, can manage | P1 - HIGH |
| `member-panel.feature` | User sees ONLY their enquiries | P2 - MEDIUM |

### UI Tests (`@ui`)
Test the **mechanics** - form navigation works:

| Feature | What It Tests | Priority |
|---------|---------------|----------|
| `form-ui.feature` | Steps render, navigation works, validation blocks | P3 - LOW |
| `validation.feature` | Input validation prevents progression | P3 - LOW |
| `navigation.feature` | Back button, progress indicator | P3 - LOW |

### Why This Matters

```
FORM (7 steps) → SUBMIT → DynamoDB (Enquiry saved) → Lambda (Emails sent)
                              ↓
                    User can LOGIN → See their enquiry
                    Admin can LOGIN → See ALL enquiries
```

**UI tests pass but CORE tests fail = App is BROKEN**
**CORE tests pass but UI tests fail = App works but UX issues**

---

## What to Test Where

### Unit Tests (Vitest)

Test **pure functions** and **business logic**:

| Category | Example | Why Unit Test |
|----------|---------|---------------|
| Pricing/calculations | `calculatePricing.ts` | Financial accuracy, many input combinations |
| Validators | `validators.ts` | Edge cases, regex patterns |
| Transformers | Data formatting functions | Deterministic, no side effects |
| Auth logic | Permission checks | Security-critical |

```typescript
// Example: Testing all pricing combinations
it.each([
  ['simple-static', 'do-it-for-me', { min: 400, max: 500 }],
  ['full-featured', 'guide-me', { min: 1800, max: 2500 }],
])('calculates %s × %s correctly', (complexity, involvement, expected) => {
  const result = calculatePricing({ complexity, involvement });
  expect(result.base).toEqual(expected);
});
```

### Integration Tests (Vitest + React Testing Library)

Test **component interactions** and **hooks**:

- Custom hooks with mocked dependencies
- Component rendering based on props/state
- Form validation UI feedback

### E2E/BDD Tests (Playwright)

Test **user journeys**, not individual features:

| Do Test | Don't Test |
|---------|------------|
| Complete form submission (1 journey covers 7 steps) | Each step loads correctly (redundant) |
| Conditional branches (Guide me vs Do it for me) | All 9 pricing combinations (unit tested) |
| Back button preserves data (1 test) | Back button works on each step (repetitive) |
| Validation blocks progression | All validation edge cases (unit tested) |

---

## BDD Structure

### Feature Files (Living Documentation)

```
features/
├── enquiry-submission.feature   # CORE: Form saves data, retrievable
├── member-panel.feature         # User views own enquiries
├── admin-panel.feature          # Admin manages all enquiries
├── form-ui.feature              # UI: Form navigation works
├── validation.feature           # UI: Validation blocks progression
└── navigation.feature           # UI: Back button, progress indicator
```

**Feature files ARE the requirements** - readable by non-technical stakeholders.

### Step Definitions

```
steps/
├── auth.steps.ts         # Login/logout for test users
├── submission.steps.ts   # Form completion + data verification
├── admin.steps.ts        # Admin actions (status, notes)
├── journey.steps.ts      # High-level journey steps
├── validation.steps.ts   # Validation-specific assertions
└── common.steps.ts       # Shared utilities
```

### Example Feature (CORE - Data Verification)

```gherkin
Feature: Enquiry Form Submission
  As a potential customer
  I want to submit my website requirements
  So that my enquiry is saved and I receive confirmation

  @critical @smoke @core
  Scenario: Form submission saves enquiry and shows confirmation
    Given I am on the enquiry form
    When I complete the full enquiry form with test data
    And I submit the enquiry
    Then I should see the thank you page
    And the enquiry should be saved to the database

  @critical @core
  Scenario: Submitted enquiry is retrievable by user
    Given I have completed and submitted an enquiry
    When I login as the test user
    And I navigate to My Enquiries
    Then I should see my recently submitted enquiry
```

### Example Feature (UI - Navigation Only)

```gherkin
Feature: Form UI and Navigation
  # NOTE: These are UI/UX tests - they verify the form WORKS mechanically.
  # The CORE test (data actually saves) is in enquiry-submission.feature.

  @ui @smoke
  Scenario: Simple website with full management (Golden Path UI)
    Given I am on the enquiry form
    When I select "Do it for me" involvement level
    # ... continues through all steps
    Then I should see the pricing summary
```

---

## Avoiding Combinatorial Explosion

### The Problem

A 7-step form with multiple options per step:
- Step 1: 3 × 3 = 9 combinations
- Step 2: 3 options
- Steps 3-5: ~100 checkbox combinations
- **Naive approach:** Thousands of E2E tests

### The Solution

| What | Test Level | Count |
|------|-----------|-------|
| Pricing matrix (9 combos) | Unit | 9 tests |
| Validation edge cases | Unit | 50+ tests |
| Full form journey | E2E | 2 tests |
| Conditional branches | E2E | 2 tests |
| Navigation mechanics | E2E | 2 tests |
| Validation blocking | E2E | 2 tests |
| Mobile responsive | E2E | 1 test |
| **Total E2E** | | **~9 tests** |

---

## Configuration

### Vitest (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        global: { statements: 70, branches: 65 }
      }
    }
  }
});
```

### Playwright BDD (`playwright.config.ts`)

```typescript
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Port 5177 matches vite.config.ts server.port
const baseURL = process.env.BASE_URL || 'http://localhost:5177';

const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  require: ['steps/**/*.ts'],
});

export default defineConfig({
  testDir,
  timeout: 30000,
  use: { baseURL },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

---

## NPM Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "e2e": "npx bddgen && playwright test",
    "e2e:ui": "npx bddgen && playwright test --ui",
    "e2e:headed": "npx bddgen && playwright test --headed",
    "e2e:setup": "npx tsx e2e/setup-test-users.ts"
  }
}
```

---

## Running Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests with coverage
npm run test:coverage

# Setup test users (once per sandbox/environment)
npm run e2e:setup

# E2E tests against local dev server
npm run e2e

# E2E tests against deployed environment
npx cross-env BASE_URL=https://dev.example.com npm run e2e

# Run by category
npm run e2e -- --grep "@core"       # CORE data persistence
npm run e2e -- --grep "@ui"         # UI navigation
npm run e2e -- --grep "@admin"      # Admin panel
npm run e2e -- --grep "@member"     # Member panel

# Debug E2E with UI
npm run e2e:ui
```

---

## CI/CD Architecture

### Overview

```
feature/xyz branch
     │
     │  PR to dev
     ▼
┌─────────────────────────────────────────────────┐
│  GitHub Actions (CI)                            │
│                                                 │
│  ┌──────┐  ┌───────────┐  ┌────────────┐       │
│  │ Lint │  │ Type Check│  │ Unit Tests │       │
│  └──┬───┘  └─────┬─────┘  └─────┬──────┘       │
│     │            │              │               │
│     └────────────┼──────────────┘               │
│                  │                              │
│         ┌────────┴────────┐                     │
│         │                 │                     │
│    ┌────▼─────┐    ┌─────▼──────┐               │
│    │ E2E UI   │    │ E2E CORE   │               │
│    │(localhost)│    │(deployed   │               │
│    │          │    │ dev URL)   │               │
│    └──────────┘    └────────────┘               │
│                                                 │
│  ALL must pass ──→ PR can be merged             │
└─────────────────────────────────────────────────┘
     │
     │  Merge to dev
     ▼
┌─────────────────────────────────────────────────┐
│  AWS Amplify (CD)                               │
│                                                 │
│  1. npx ampx pipeline-deploy (backend)          │
│  2. npm run build (frontend)                    │
│  3. Deploy to CloudFront                        │
└─────────────────────────────────────────────────┘
```

### Why This Split

| Concern | Owner | Why |
|---------|-------|-----|
| Tests pass? | GitHub Actions (CI) | Fast feedback, blocks bad merges |
| Code deployed? | Amplify (CD) | Already configured, handles infra |
| Branch protection? | GitHub (settings) | Enforces the workflow |

### GitHub Actions Jobs

```
jobs:
  lint          ──┐
  type-check    ──┤── run in parallel (fast)
  unit-tests    ──┘
                  │
                  ▼
  e2e-ui        ──┐── run after fast checks pass
  e2e-core      ──┘   (also in parallel with each other)
```

- **e2e-ui**: Runs against localhost with mock Amplify config. No secrets needed.
- **e2e-core**: Runs against deployed dev URL. Requires `DEV_APP_URL` variable and test user secrets. Only runs on PRs (not every push).

### Required GitHub Configuration

**Repository Variables** (Settings > Variables > Actions):

| Variable | Example Value | Purpose |
|----------|---------------|---------|
| `DEV_APP_URL` | `https://dev.d1abc2def.amplifyapp.com` | Deployed dev URL |

**Repository Secrets** (Settings > Secrets > Actions):

| Secret | Purpose |
|--------|---------|
| `E2E_TEST_USER_EMAIL` | Regular test user email |
| `E2E_TEST_USER_PASSWORD` | Regular test user password |
| `E2E_ADMIN_EMAIL` | Admin test user email |
| `E2E_ADMIN_PASSWORD` | Admin test user password |

### Branch Protection Rules

Both `main` and `dev` branches should be protected:

| Setting | Value |
|---------|-------|
| Require pull request before merging | Yes |
| Require status checks to pass | Yes |
| Required checks | `Lint`, `Type Check`, `Unit Tests`, `E2E UI Tests` |
| Require branches to be up to date | Yes |
| Allow force pushes | No |

---

## Coverage Targets

| Scope | Target |
|-------|--------|
| Global statements | 70% |
| Global branches | 65% |
| Business logic (`calculatePricing.ts`) | 95% |
| Security (`authWhitelist.ts`) | 100% |
| Validators | 90% |

---

## Tags for Test Organization

```gherkin
# Priority Tags
@core        # CORE functionality - data saves, auth works (P0-P1)
@critical    # Must pass before deploy
@smoke       # Quick sanity checks

# Feature Tags
@ui          # UI/UX tests - navigation, rendering (P3)
@admin       # Admin-only features (requires admin login)
@member      # Member features (requires user login)
@auth-required  # Test requires authentication

# Technical Tags
@conditional # Tests conditional form branches
@validation  # Validation-related scenarios
@navigation  # Navigation mechanics
@mobile      # Responsive design tests
@wip         # Work in progress (skip in CI)
```

Run specific tags:
```bash
# Run CORE tests only (P0-P1, require credentials)
npm run e2e -- --grep "@core"

# Run UI tests only (P3, no credentials needed)
npm run e2e -- --grep "@ui"

# Run admin tests
npm run e2e -- --grep "@admin"

# Run all critical tests
npm run e2e -- --grep "@critical"

# Skip work-in-progress
npm run e2e -- --grep-invert "@wip"
```

---

## Key Decisions

1. **Vitest over Jest** - Native Vite integration, faster execution
2. **playwright-bdd over Cucumber** - Single test runner, better debugging
3. **Journey tests over step tests** - One journey covers all steps
4. **Unit test combinations** - Pricing matrix tested 9× in unit tests, not E2E
5. **Feature files as requirements** - Living documentation, version controlled

---

## Dependencies

```bash
# Unit testing
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom

# E2E/BDD testing
npm i -D @playwright/test playwright-bdd

# Cross-platform env vars (Windows compatibility)
npm i -D cross-env
```

---

## Checklist for New Features

When adding a new feature:

- [ ] Write unit tests for pure functions/business logic
- [ ] Add integration tests for hook/component interactions
- [ ] Update existing journey test OR add new scenario if new user path
- [ ] Do NOT add E2E test for logic already covered by unit tests
- [ ] Run full suite before PR: `npm test && npm run e2e`

---

## Test Data Management

### Test User Accounts

Two test accounts are required in Cognito:

| Account | Purpose | Cognito Group |
|---------|---------|---------------|
| Regular user | Submit enquiries, view own only | (none) |
| Admin user | View ALL enquiries, manage status | `Admins` |

### Test Data Isolation

Test data is isolated using markers:

```typescript
// e2e/test-config.ts
export const testConfig = {
  testMarkers: {
    businessDescriptionPrefix: '[E2E-TEST]',
    testEmailDomain: 'e2e-test.example.com',
  },
};

// Generates: e2e-1707316800000@e2e-test.example.com
export function generateTestEmail(): string {
  return `e2e-${Date.now()}@${testConfig.testMarkers.testEmailDomain}`;
}
```

### Cleanup Strategy

Test enquiries are identified by:
- Email domain: `@e2e-test.example.com`
- Description prefix: `[E2E-TEST]`

These can be cleaned up periodically via a scheduled Lambda or manual query.

---

## Data Verification Approach

CORE tests verify data actually saved to DynamoDB:

```typescript
// Option A: GraphQL query after submit (preferred)
Then('the enquiry should be saved to the database', async ({ page }) => {
  // Query via authenticated API to verify data exists
  const enquiries = await client.models.Enquiry.list({
    filter: { email: { eq: testEmail } }
  });
  expect(enquiries.data.length).toBeGreaterThan(0);
});

// Option B: UI verification (tests two features at once)
Then('I should see my recently submitted enquiry', async ({ page }) => {
  // Login → Navigate → Verify enquiry appears in list
  await page.goto('/account/enquiries');
  await expect(page.getByText(testData.businessDescription)).toBeVisible();
});
```

---

## Setup Pitfalls & Troubleshooting

Lessons learned from setting up this testing infrastructure. Reference this when things break.

### Port Synchronisation (Vite + Playwright)

**Problem:** Vite defaults to port 5173. If another app is on that port, Vite silently picks a different one. Playwright then connects to the wrong server (or the wrong app entirely).

**Solution:** Pin the port in both configs and fail loudly if busy:

```typescript
// vite.config.ts
server: {
  port: 5177,
  strictPort: true, // Fail if port is busy, don't silently pick another
}

// playwright.config.ts
const baseURL = process.env.BASE_URL || 'http://localhost:5177';
```

**Rule:** The port number must match in exactly 3 places:
1. `vite.config.ts` → `server.port`
2. `playwright.config.ts` → `baseURL` fallback
3. `playwright.config.ts` → `webServer.url`

If you change the port, grep for the old one across all config files.

### Amplify Config in CI (`amplify_outputs.json`)

**Problem:** `amplify_outputs.json` is gitignored (contains environment-specific AWS config). Without it, `npm run build`, `tsc --noEmit`, and the dev server all fail.

**Solution:** A mock file `amplify_outputs.mock.json` is committed to the repo. CI copies it before any step that needs it:

```yaml
- name: Create mock Amplify config
  run: cp amplify_outputs.mock.json amplify_outputs.json
```

**Where it's needed:**
- Type Check job (for `tsc --noEmit`)
- E2E UI job (for `npm run dev` via webServer)
- NOT needed for Lint or Unit Tests (they don't import Amplify config)

### Test User Accounts (Cognito)

**Problem:** E2E CORE tests require authenticated users. Test users don't exist in a fresh Cognito sandbox.

**Solution:** Run `npm run e2e:setup` once per sandbox/environment. This creates:

| User | Email | Cognito Groups |
|------|-------|---------------|
| Regular | `test_user@arkadiuszkulpa.co.uk` | `Users` |
| Admin | `test_admin@arkadiuszkulpa.co.uk` | `Admins`, `Users` |

**When to re-run:** After destroying and recreating a sandbox, or when deploying to a new environment.

**Credentials flow:**
- **Local:** Hardcoded fallbacks in `e2e/test-config.ts` (sandbox only)
- **CI:** Environment variables from GitHub Secrets → `e2e/test-config.ts` reads `process.env.*`

### GitHub Actions & Amplify: CI vs CD

**Problem:** Amplify has its own build pipeline, so adding GitHub Actions can feel redundant or conflicting. Who owns what?

**Answer:** They serve different purposes and don't conflict:

```
GitHub Actions = CI (quality gate)    →  "Can this code be merged?"
AWS Amplify    = CD (deployment)      →  "Deploy the merged code"
```

**Flow:**
1. Developer pushes `feature/xyz` → creates PR to `dev`
2. GitHub Actions runs: lint → type-check → unit tests → E2E
3. Branch protection blocks merge until checks pass
4. Developer merges PR
5. Amplify detects push to `dev` → builds → deploys

**They never step on each other** because GitHub Actions runs on the PR (before merge) and Amplify runs after merge.

### GitHub Repository Configuration Checklist

Everything that needs to be configured in GitHub Settings for CI to work:

**Default Branch** (Settings → General):
- Set to `dev` (not `main`) so PRs auto-target `dev`

**Repository Variables** (Settings → Secrets and variables → Actions → Variables):

| Variable | Value | Used By |
|----------|-------|---------|
| `DEV_APP_URL` | Your Amplify dev URL (e.g. `https://dev.d1abc2def.amplifyapp.com`) | E2E Core Tests |

**Repository Secrets** (Settings → Secrets and variables → Actions → Secrets):

| Secret | Used By |
|--------|---------|
| `E2E_TEST_USER_EMAIL` | E2E Core Tests |
| `E2E_TEST_USER_PASSWORD` | E2E Core Tests |
| `E2E_ADMIN_EMAIL` | E2E Core Tests |
| `E2E_ADMIN_PASSWORD` | E2E Core Tests |

**Branch Protection Rulesets** (Settings → Rules → Rulesets):

Create separate rulesets for `dev` and `main`:

| Setting | `dev` ruleset | `main` ruleset |
|---------|--------------|----------------|
| Require PR before merging | Yes | Yes |
| Require status checks | Lint, Type Check, Unit Tests, E2E UI Tests | Same + E2E Core Tests |
| Require branch up to date | Yes | Yes |
| Allow force pushes | No | No |

**Note:** Status check names must match the `name:` field in the workflow YAML exactly (e.g. `Lint`, not `lint`).

### Playwright Strict Mode Errors

**Problem:** Playwright's strict mode throws when a locator matches more than one element. Common culprits:

| Locator | Why It Fails | Fix |
|---------|-------------|-----|
| `getByText(/enquir/i)` | Matches nav link, heading, and paragraph | Use `getByRole('heading', { name: /enquiries/i })` |
| `getByText(/thank you/i)` | Matches h1 and confirmation paragraph | Use `getByRole('heading', { name: /thank you/i })` |
| `getByRole('button', { name: /add/i })` | Matches multiple "Add note" buttons | Use `{ name: 'Add Note', exact: true }` |
| `getByText(/[E2E-TEST]/i)` | Brackets are regex special chars, matches everything | Escape brackets: `.replace(/[[\]]/g, '\\$&')` |

**General rules:**
- Prefer `getByRole()` over `getByText()` — roles are more specific
- Use `{ exact: true }` when you need an exact match
- Use `.first()` when multiple matches are expected (e.g. notes from previous runs)
- Scope locators with `.locator('table tbody')` to avoid matching nav/header elements

### ESLint in CI vs Local

**Problem:** Code works locally but CI lint fails with `no-unused-vars` or `no-explicit-any`.

**Common patterns that fail lint:**

```typescript
// ✗ Unused import
import { UsernameExistsException } from '...'; // Remove if only checking error.name

// ✗ catch(error) unused
} catch (error) {     // → } catch (_error) {

// ✗ any type
} catch (error: any) { // → } catch (error: unknown) {
  error.message         //     (error instanceof Error ? error.message : error)

// ✗ Assigned but unused variable
const success = page.getByText(...); // → const _success = ...
```

**Rule:** Always prefix intentionally unused variables with `_` (underscore).

### E2E Test Categories: UI vs CORE

**Problem:** Running all E2E tests in every context wastes time and fails due to missing credentials.

**Solution:** Tests are tagged and run selectively:

| Context | What Runs | Why |
|---------|-----------|-----|
| CI (every push/PR) | `@ui`, `@validation`, `@navigation` | No auth needed, runs against localhost |
| CI (PRs only, when DEV_APP_URL set) | `@core`, `@admin`, `@member` | Needs real backend + test credentials |
| Local development | All (if sandbox running) | Full suite against local sandbox |

**The `e2e-core` job has a guard:**
```yaml
if: github.event_name == 'pull_request' && vars.DEV_APP_URL != ''
```
This means core tests only run on PRs AND only when `DEV_APP_URL` is configured. If the variable is missing, the job is skipped silently (not failed).

### Branching Workflow

**Problem:** PRs defaulting to `main` instead of `dev`, or accidentally merging feature branches directly to `main`.

**Solution:**
1. Set `dev` as the **default branch** in GitHub (Settings → General)
2. All feature branches PR into `dev` (happens automatically with default branch set)
3. `dev` → `main` PRs are manual, for releases only
4. Both branches are protected — no direct pushes

```
feature/xyz → PR → dev (CI runs) → merge → Amplify deploys to dev
                    dev → PR → main (CI runs) → merge → Amplify deploys to prod
```

**If branches get out of sync** (e.g. something merged directly to main):
- Create a PR from `main` → `dev` to bring dev up to date
- Or locally: `git checkout dev && git merge origin/main && git push`

---

*Last updated: 2026-02-13*
