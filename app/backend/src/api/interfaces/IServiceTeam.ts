import TeamsModel from '../../database/models/TeamsModel';

export default interface IServiceTeam {
  getAll(): Promise<TeamsModel[]>;
  getById(id: number): Promise<TeamsModel | null>;
}
