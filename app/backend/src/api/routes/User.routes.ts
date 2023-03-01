import { Request, Response, Router } from 'express';
import { verifyToken } from '../../utils/JWT';

import UserController from '../controllers/UserController';
import LoginMiddleware from '../middlewares/LoginMiddleware';

const router = Router();

const controller = new UserController();

router.get(
  '/login/role',
  verifyToken,
  (_req: Request, res: Response) => res.status(200).json({ role: res.locals.user.role }),
);

router.use(LoginMiddleware.validateBody);
router.post('/login', controller.login);

export default router;
