import { ModelStatic } from 'sequelize';
import TeamsModel from '../../database/models/TeamsModel';
import IServiceTeam from '../interfaces/IServiceTeam';

class TeamService implements IServiceTeam {
  protected model: ModelStatic<TeamsModel> = TeamsModel;

  async getAll(): Promise<TeamsModel[]> {
    return this.model.findAll();
  }

  async getById(id: number): Promise<TeamsModel | null> {
    return this.model.findByPk(id);
  }
}

export default TeamService;
