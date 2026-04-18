import { compare } from "bcryptjs";

import { hasAdminSessionConfig } from "@/services/adminSession";

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH) && hasAdminSessionConfig();
}

export async function verifyAdminPassword(password: string) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    return false;
  }

  return compare(password, passwordHash);
}
