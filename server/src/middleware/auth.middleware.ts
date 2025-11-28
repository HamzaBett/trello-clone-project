import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token is required' });
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
