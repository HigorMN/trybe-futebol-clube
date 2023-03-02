import { Request, Response, NextFunction } from 'express';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!(/\S+@\S+\.\S+/.test(email)) || password.length < 6) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  next();
};

export default validateLogin;
