import { Request, Response } from 'express';
import IServiceTeam from '../interfaces/IServiceTeam';

class TeamController {
  private _service: IServiceTeam;

  constructor(service: IServiceTeam) {
    this._service = service;
  }

  async getAll(_req: Request, res: Response) {
    const result = await this._service.getAll();

    res.status(200).json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._service.getById(+id);

    res.status(200).json(result);
  }
}

export default TeamController;
