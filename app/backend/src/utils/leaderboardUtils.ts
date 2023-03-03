import ITeamLeaderboard from '../api/interfaces/ITeamLeaderboard';
import Matches from '../database/models/MatchesModel';

type TypeGoals = 'homeTeamGoals' | 'awayTeamGoals';

export const goalsCounter = (matche: Matches[], goals: TypeGoals) =>
  matche.reduce((acc, curr) => acc + curr[goals], 0);

export const totalVLD = (matche: Matches[], goals: TypeGoals[]) => {
  let victories = 0;
  let losses = 0;
  let draws = 0;

  matche.forEach((e) => {
    if (e[goals[0]] === e[goals[1]]) draws += 1;
    if (e[goals[0]] > e[goals[1]]) victories += 1;
    if (e[goals[0]] < e[goals[1]]) losses += 1;
  });

  return { victories, losses, draws };
};

export const totalPoints = (matche: Matches[], goals: TypeGoals[]): number => {
  const { victories, draws } = totalVLD(matche, goals);
  return (victories * 3) + draws;
};

export const goalsBalanceCouter = (matche: Matches[], goals: TypeGoals[]): number =>
  goalsCounter(matche, goals[0]) - goalsCounter(matche, goals[1]);

export const efficiency = (matche: Matches[], goals: TypeGoals[]): string => {
  const p = totalPoints(matche, goals);
  const j = matche.length;
  const result = (p / (j * 3)) * 100;
  return result.toFixed(2);
};

export const leaderboardResults = (team: string, matche: Matches[], goals: TypeGoals[]) => ({
  name: team,
  totalPoints: totalPoints(matche, goals),
  totalGames: matche.length,
  totalVictories: totalVLD(matche, goals).victories,
  totalDraws: totalVLD(matche, goals).draws,
  totalLosses: totalVLD(matche, goals).losses,
  goalsFavor: goalsCounter(matche, goals[0]),
  goalsOwn: goalsCounter(matche, goals[1]),
  goalsBalance: goalsBalanceCouter(matche, goals),
  efficiency: efficiency(matche, goals),
});

export const orderResults = (teams: ITeamLeaderboard[]) =>
  teams.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return a.goalsOwn - b.goalsOwn;
  });
