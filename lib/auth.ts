import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'encourtyard_super_secret_jwt_key_2026_botanical_sanctuary_secure_token';
const key = new TextEncoder().encode(JWT_SECRET);

export const USER_COOKIE_NAME = 'enc_user_session';
export const ADMIN_COOKIE_NAME = 'enc_admin_session';

// 30 Days persistent session duration
export const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface UserJwtPayload {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  isEmailVerified: boolean;
  company?: string | null;
}

export interface AdminJwtPayload {
  adminId: string;
  name: string;
  email: string;
  role: 'ADMIN';
  isSuperAdmin: boolean;
}

// --- Password Hashing Utilities ---
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- JWT Token Generation & Verification ---
export async function signUserToken(payload: UserJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function verifyUserToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}

// --- Server-side Session Extraction Helpers ---
export async function getCurrentUser(): Promise<UserJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyUserToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

// --- Admin Credentials Verification against .env ---
export function validateAdminCredentials(idInput: string, passwordInput: string): boolean {
  const envAdminId = (process.env.ADMIN_ID || 'Admin').trim();
  const envAdminPassword = (process.env.ADMIN_PASSWORD || 'Ranchi#0000').trim();

  const idMatch = idInput.trim().toLowerCase() === envAdminId.toLowerCase() ||
                 idInput.trim().toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@encourtyard.com').toLowerCase();
  
  const passwordMatch = passwordInput === envAdminPassword;

  return idMatch && passwordMatch;
}
