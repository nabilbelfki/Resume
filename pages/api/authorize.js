// pages/api/authorize.js
import { verifyToken } from '../../lib/auth';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.auth;
    
    if (!token) {
      return res.status(200).json({ isAuthenticated: false, user: null });
    }

    const userData = verifyToken(token);
    
    if (!userData) {
      return res.status(200).json({ isAuthenticated: false, user: null });
    }

    return res.status(200).json({ 
      isAuthenticated: true,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        role: userData.role
      }
    });

  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(200).json({ isAuthenticated: false, user: null });
  }
}