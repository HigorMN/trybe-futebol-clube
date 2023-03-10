import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

class LeaderboardController {
  private _service: LeaderboardService = new LeaderboardService();

  getRankHome = async (_req: Request, res: Response) => {
    const result = await this._service.getRankHome();

    return res.status(200).json(result);
  };

  getRankAway = async (_req: Request, res: Response) => {
    const result = await this._service.getRankAway();

    return res.status(200).json(result);
  };

  getRankAll = async (_req: Request, res: Response) => {
    const result = await this._service.getRankAll();

    return res.status(200).json(result);
  };
}

export default LeaderboardController;
