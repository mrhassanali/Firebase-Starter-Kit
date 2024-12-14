export const DOMAIN: string =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://example.com";
export const ROOT: string = "/";
export const LOGIN: string = `${ROOT}login`;
