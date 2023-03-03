import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRoutes = Router();
const controller = new LeaderboardController();

leaderboardRoutes.get('/leaderboard/home', controller.getRankHome);

export default leaderboardRoutes;
