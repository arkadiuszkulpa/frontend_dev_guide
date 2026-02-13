import { createBdd } from 'playwright-bdd';

// Re-export from journey and validation steps
// This file now just serves as a shared import point

export const { Given, When, Then } = createBdd();

// All step definitions are now in:
// - journey.steps.ts (form journey steps)
// - validation.steps.ts (validation-specific steps)
