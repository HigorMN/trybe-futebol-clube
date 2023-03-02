import { Request, Response } from 'express';
import MatcheService from '../services/MatcheService';

class MatcheController {
  private _service: MatcheService = new MatcheService();

  getAll = async (_req: Request, res: Response) => {
    const result = await this._service.getAll();

    res.status(200).json(result);
  };
}

export default MatcheController;
