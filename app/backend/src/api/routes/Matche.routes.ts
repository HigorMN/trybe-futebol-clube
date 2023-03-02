import { Router } from 'express';
import MatcheController from '../controllers/MatcheController';

const matcheRoutes = Router();

const controller = new MatcheController();

matcheRoutes.get('/matches', controller.getAllInProgress);

export default matcheRoutes;
