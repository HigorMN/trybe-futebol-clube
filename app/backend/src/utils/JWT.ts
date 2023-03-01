import { sign, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ILoginJWT from '../api/interfaces/ILoginJWT';

const JWT_SECRET = process.env.JWT_SECRET || 'secret' as string;

export const generateToken = (login: ILoginJWT) =>
  sign(login, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    const verification = verify(token, JWT_SECRET);
    res.locals.user = verification;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};
