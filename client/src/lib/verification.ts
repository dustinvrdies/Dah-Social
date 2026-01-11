const STORAGE_PREFIX = "dah.verification";

export type VerificationTier = "email" | "phone" | "id";

export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  emailVerifiedAt?: number;
  phoneVerifiedAt?: number;
  idVerifiedAt?: number;
  email?: string;
  phone?: string;
  realName?: string;
}

export interface PendingVerification {
  code: string;
  type: "email" | "phone";
  target: string;
  expiresAt: number;
  attempts: number;
}

export interface UserConsent {
  termsAccepted: boolean;
  termsAcceptedAt?: number;
  privacyAccepted: boolean;
  privacyAcceptedAt?: number;
  parentalConsentAcknowledged?: boolean;
  parentalConsentAt?: number;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getVerificationStatus(username: string): VerificationStatus {
  const key = `${STORAGE_PREFIX}.status.${username}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultStatus();
    }
  }
  return getDefaultStatus();
}

function getDefaultStatus(): VerificationStatus {
  return {
    emailVerified: false,
    phoneVerified: false,
    idVerified: false,
  };
}

export function saveVerificationStatus(username: string, status: VerificationStatus): void {
  const key = `${STORAGE_PREFIX}.status.${username}`;
  localStorage.setItem(key, JSON.stringify(status));
}

export function getUserConsent(username: string): UserConsent {
  const key = `${STORAGE_PREFIX}.consent.${username}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { termsAccepted: false, privacyAccepted: false };
    }
  }
  return { termsAccepted: false, privacyAccepted: false };
}

export function saveUserConsent(username: string, consent: UserConsent): void {
  const key = `${STORAGE_PREFIX}.consent.${username}`;
  localStorage.setItem(key, JSON.stringify(consent));
}

export function createPendingVerification(
  username: string,
  type: "email" | "phone",
  target: string
): string {
  const code = generateCode();
  const pending: PendingVerification = {
    code,
    type,
    target,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };
  const key = `${STORAGE_PREFIX}.pending.${username}.${type}`;
  localStorage.setItem(key, JSON.stringify(pending));
  return code;
}

export function getPendingVerification(
  username: string,
  type: "email" | "phone"
): PendingVerification | null {
  const key = `${STORAGE_PREFIX}.pending.${username}.${type}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    const pending = JSON.parse(stored) as PendingVerification;
    if (Date.now() > pending.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export function verifyCode(
  username: string,
  type: "email" | "phone",
  inputCode: string
): { success: boolean; error?: string } {
  const pending = getPendingVerification(username, type);
  
  if (!pending) {
    return { success: false, error: "Verification code expired. Please request a new one." };
  }
  
  if (pending.attempts >= 5) {
    localStorage.removeItem(`${STORAGE_PREFIX}.pending.${username}.${type}`);
    return { success: false, error: "Too many attempts. Please request a new code." };
  }
  
  pending.attempts += 1;
  localStorage.setItem(
    `${STORAGE_PREFIX}.pending.${username}.${type}`,
    JSON.stringify(pending)
  );
  
  if (pending.code !== inputCode) {
    return { success: false, error: `Invalid code. ${5 - pending.attempts} attempts remaining.` };
  }
  
  const status = getVerificationStatus(username);
  const now = Date.now();
  
  if (type === "email") {
    status.emailVerified = true;
    status.emailVerifiedAt = now;
    status.email = pending.target;
  } else {
    status.phoneVerified = true;
    status.phoneVerifiedAt = now;
    status.phone = pending.target;
  }
  
  saveVerificationStatus(username, status);
  localStorage.removeItem(`${STORAGE_PREFIX}.pending.${username}.${type}`);
  
  return { success: true };
}

export function verifyIdentity(
  username: string,
  realName: string
): void {
  const status = getVerificationStatus(username);
  status.idVerified = true;
  status.idVerifiedAt = Date.now();
  status.realName = realName;
  saveVerificationStatus(username, status);
}

export function getVerificationTiers(username: string): VerificationTier[] {
  const status = getVerificationStatus(username);
  const tiers: VerificationTier[] = [];
  if (status.emailVerified) tiers.push("email");
  if (status.phoneVerified) tiers.push("phone");
  if (status.idVerified) tiers.push("id");
  return tiers;
}

export function getVerificationLevel(username: string): number {
  return getVerificationTiers(username).length;
}

export function isFullyVerified(username: string): boolean {
  return getVerificationLevel(username) >= 3;
}
