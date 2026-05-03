// Loaded by Jest via `setupFiles` before any test module is imported.
// `src/services/api.ts` reads EXPO_PUBLIC_API_BASE_URL at module-load time, so
// the test default must be set here rather than in setupFilesAfterEnv.
process.env.EXPO_PUBLIC_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost/api";
