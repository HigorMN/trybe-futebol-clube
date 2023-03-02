import { Request, Response } from 'express';
import MatcheService from '../services/MatcheService';

class MatcheController {
  private _service: MatcheService = new MatcheService();

  getAll = async (_req: Request, res: Response) => {
    const result = await this._service.getAll();

    return res.status(200).json(result);
  };

  getAllInProgress = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    if (!inProgress) {
      const result = await this._service.getAll();

      return res.status(200).json(result);
    }

    const validBoolean = inProgress === 'true';

    const result = await this._service.getAllInProgress(validBoolean);

    return res.status(200).json(result);
  };
}

export default MatcheController;
