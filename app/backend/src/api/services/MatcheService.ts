import { ModelStatic } from 'sequelize';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import IResponse from '../interfaces/IResponse';
import IGoalsMatches from '../interfaces/IGoalsMatches';
import ICreateMatches from '../interfaces/ICreateMatches';

class MatcheService {
  protected model: ModelStatic<Matches> = Matches;
  protected teamModel: ModelStatic<Teams> = Teams;

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

  async create(body: ICreateMatches): Promise<IResponse> {
    const { homeTeamId, awayTeamId } = body;

    const findHomeTeam = await this.teamModel.findByPk(homeTeamId);
    if (!findHomeTeam) return { type: 404, message: 'There is no team with such id!' };

    const findAwayTeam = await this.teamModel.findByPk(awayTeamId);
    if (!findAwayTeam) return { type: 404, message: 'There is no team with such id!' };

    if (homeTeamId === awayTeamId) {
      return {
        type: 422,
        message: 'It is not possible to create a match with two equal teams',
      };
    }

    const created = await this.model.create({ ...body, inProgress: true });

    return { createdMatche: created };
  }
}

export default MatcheService;
