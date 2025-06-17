export default {
  preset: "ts-jest",
  testEnvironment: "node",
  /** Opcional: alias “@/” de tu proyecto Next */
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["<rootDir>/jest.setup.ts"], // para variables de entorno
  silent: true,
};
