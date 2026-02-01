import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-at-least-32-chars';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: MAX_AGE }
  );
}

export function setTokenCookie(res, token) {
  const cookie = serialize('auth', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function removeTokenCookie(res) {
  const cookie = serialize('auth', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}
