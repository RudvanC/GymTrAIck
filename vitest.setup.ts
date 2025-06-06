// vitest.setup.ts

import { expect, afterEach, vi } from "vitest";

// Limpia mocks después de cada test para evitar efectos colaterales
afterEach(() => {
  vi.clearAllMocks();
});
