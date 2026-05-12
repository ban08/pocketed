const DEFAULT_BASE_URL = "http://91.98.197.3:5022/api";

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
