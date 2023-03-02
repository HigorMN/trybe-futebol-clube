import { Request, Response } from 'express';
import MatcheService from '../services/MatcheService';

class MatcheController {
  private _service: MatcheService = new MatcheService();

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

  finishedUpdate = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { message } = await this._service.finishedUpdate(+id);

    return res.status(200).json({ message });
  };

  updateGoals = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { message } = await this._service.updateGoals(req.body, +id);

    return res.status(200).json({ message });
  };

  create = async (req: Request, res: Response) => {
    const { type, message, createdMatche } = await this._service.create(req.body);

    if (type) return res.status(type).json({ message });

    return res.status(201).json(createdMatche);
  };
}

export default MatcheController;
