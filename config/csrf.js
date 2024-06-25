// csrf.ts
import { doubleCsrf } from 'csrf-csrf';
import { randomBytes } from 'node:crypto';

const csrfSecret = randomBytes(20).toString('hex');

const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api',
};

export const { doubleCsrfProtection, generateToken } = doubleCsrf({
  // The entropy (in bits) of the generated tokens
  size: 4 * 8,
  // A function that optionally takes the request and returns a secret
  getSecret: () => csrfSecret,
  cookieName: 'some-random-cookie',
  cookieOptions,
});
