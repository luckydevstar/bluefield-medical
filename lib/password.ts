import bcrypt from "bcrypt";

const ROUNDS = 12; // adjust if needed (12 is a good default)

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
