import { ModelStatic } from 'sequelize';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';

class MatcheService {
  protected model: ModelStatic<Matches> = Matches;

  async getAll(): Promise<Matches[]> {
    return this.model.findAll({ include: [
      { model: Teams, as: 'homeTeam' },
      { model: Teams, as: 'awayTeam' },
    ] });
  }
}

export default MatcheService;
