import { ModelStatic } from 'sequelize';
import { orderResults, leaderboardResults } from '../../utils/leaderboardUtils';
import Teams from '../../database/models/TeamsModel';
import Matches from '../../database/models/MatchesModel';
import ITeamLeaderboard from '../interfaces/ITeamLeaderboard';

class LeaderboardService {
  protected modelMatches: ModelStatic<Matches> = Matches;
  protected modelTeams: ModelStatic<Teams> = Teams;

  async getRankHome(): Promise<ITeamLeaderboard[]> {
    const findTeam = await this.modelTeams.findAll();
    const findMathes = await this.modelMatches.findAll({ where: { inProgress: false } });
    const result: ITeamLeaderboard[] = [];
    findTeam.forEach((t) => {
      const matche = findMathes.filter((m) => m.homeTeamId === t.id);
      result.push(leaderboardResults(t.teamName, matche, ['homeTeamGoals', 'awayTeamGoals']));
    });

    return orderResults(result);
  }
}

export default LeaderboardService;
