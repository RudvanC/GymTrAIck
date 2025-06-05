// Barrel file for the userAnswers module.
// This file re-exports all public functions and types from other files within this directory,
// allowing for cleaner and more centralized imports in other parts of the application.
// For example, instead of `import { insertUserAnswers } from "@/lib/userAnswers/insert";`,
// consumers can use `import { insertUserAnswers } from "@/lib/userAnswers";`.

export * from "./insert"; // Re-exports all exports from insert.ts (e.g., insertUserAnswers)
export * from "./fetch"; // Re-exports all exports from fetch.ts (e.g., fetchUserAnswersByUserId)
