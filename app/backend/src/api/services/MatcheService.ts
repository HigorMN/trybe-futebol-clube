import { ModelStatic } from 'sequelize';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import IResponse from '../interfaces/IResponse';
import IGoalsMatches from '../interfaces/IGoalsMatches';

class MatcheService {
  protected model: ModelStatic<Matches> = Matches;

  async getAll(): Promise<Matches[]> {
    return this.model.findAll({ include: [
      { model: Teams, as: 'homeTeam' },
      { model: Teams, as: 'awayTeam' },
    ] });
  }

  async getAllInProgress(inProgress: boolean): Promise<Matches[]> {
    return this.model.findAll(
      {
        where: { inProgress },
        include: [
          { model: Teams, as: 'homeTeam' },
          { model: Teams, as: 'awayTeam' },
        ],
      },
    );
  }

  async finishedUpdate(id: number): Promise<IResponse> {
    this.model.update({ inProgress: false }, { where: { id } });

    return { message: 'Finished' };
  }

  async updateGoals(body: IGoalsMatches, id: number): Promise<IResponse> {
    this.model.update(body, { where: { id } });

    return { message: 'updated goals' };
  }
}

export default MatcheService;
