import { Router } from 'express';
import MatcheController from '../controllers/MatcheController';
import verifyToken from '../middlewares/verifyToken';

const matcheRoutes = Router();

const controller = new MatcheController();

matcheRoutes.get('/matches', controller.getAllInProgress);
matcheRoutes.patch('/matches/:id/finish', verifyToken, controller.finishedUpdate);
matcheRoutes.patch('/matches/:id', verifyToken, controller.updateGoals);
matcheRoutes.post('/matches', verifyToken, controller.create);

export default matcheRoutes;
