import { Request, Response, Router } from 'express';
import { verifyToken } from '../../utils/JWT';

import UserController from '../controllers/UserController';
import validateLogin from '../middlewares/LoginMiddleware';

const router = Router();

const controller = new UserController();

router.get(
  '/login/role',
  verifyToken,
  (_req: Request, res: Response) => res.status(200).json({ role: res.locals.user.role }),
);

router.post('/login', validateLogin, controller.login);

export default router;
