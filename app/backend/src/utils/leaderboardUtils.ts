import ITeamLeaderboard from '../api/interfaces/ITeamLeaderboard';
import Matches from '../database/models/MatchesModel';

export const goalsFavorHome = (matche: Matches[]): number =>
  matche.reduce((acc, curr) => acc + curr.homeTeamGoals, 0);

export const goalsOwnHome = (matche: Matches[]): number =>
  matche.reduce((acc, curr) => acc + curr.awayTeamGoals, 0);

export const totalVLDHome = (matche: Matches[]) => {
  let victories = 0;
  let losses = 0;
  let draws = 0;

  matche.forEach((e) => {
    if (e.homeTeamGoals === e.awayTeamGoals) draws += 1;
    if (e.homeTeamGoals > e.awayTeamGoals) victories += 1;
    if (e.homeTeamGoals < e.awayTeamGoals) losses += 1;
  });
  return { victories, losses, draws };
};

export const totalPointsHome = (matche: Matches[]): number => {
  const { victories, draws } = totalVLDHome(matche);
  return (victories * 3) + draws;
};

export const goalsBalanceHome = (matche: Matches[]): number => {
  const golsFavor = goalsFavorHome(matche);
  const goalsOwn = goalsOwnHome(matche);

  return golsFavor - goalsOwn;
};

export const efficiencyHome = (matche: Matches[]): string => {
  const p = totalPointsHome(matche);
  const j = matche.length;
  const result = (p / (j * 3)) * 100;
  return result.toFixed(2);
};

export const resultsHome = (team: string, matche: Matches[]) => ({
  name: team,
  totalPoints: totalPointsHome(matche),
  totalGames: matche.length,
  totalVictories: totalVLDHome(matche).victories,
  totalDraws: totalVLDHome(matche).draws,
  totalLosses: totalVLDHome(matche).losses,
  goalsFavor: goalsFavorHome(matche),
  goalsOwn: goalsOwnHome(matche),
  goalsBalance: goalsBalanceHome(matche),
  efficiency: efficiencyHome(matche),
});

export const orderResults = (teams: ITeamLeaderboard[]) =>
  teams.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return a.goalsOwn - b.goalsOwn;
  });
