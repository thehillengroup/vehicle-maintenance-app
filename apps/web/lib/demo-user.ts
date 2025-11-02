import { ensureUserByEmail } from "@repo/db";

const DEFAULT_EMAIL = process.env.DEMO_USER_EMAIL ?? "demo@example.com";

export const getDemoUser = async () => {
  return ensureUserByEmail(DEFAULT_EMAIL);
};
