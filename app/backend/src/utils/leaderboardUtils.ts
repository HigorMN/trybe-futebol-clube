import ITeamLeaderboard from '../api/interfaces/ITeamLeaderboard';
import Matches from '../database/models/MatchesModel';

type TypeGoals = 'homeTeamGoals' | 'awayTeamGoals';

const arrayGoals: TypeGoals[] = ['homeTeamGoals', 'awayTeamGoals'];
const arrayGoals2: TypeGoals[] = ['awayTeamGoals', 'homeTeamGoals'];

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

export const efficiencyAll = (matcheHome: Matches[], matcheAway: Matches[]): string => {
  const p = totalPoints(matcheHome, arrayGoals) + totalPoints(matcheAway, arrayGoals2);
  const j = matcheHome.length + matcheAway.length;
  const result = (p / (j * 3)) * 100;
  return result.toFixed(2);
};

export const leaderboardResults = (teamname: string, matche: Matches[], goals: TypeGoals[]) => ({
  name: teamname,
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

export const leaderboardAll = (teamName: string, matcheHome: Matches[], matcheAway: Matches[]) => ({
  name: teamName,
  totalPoints: totalPoints(matcheHome, arrayGoals) + totalPoints(matcheAway, arrayGoals2),
  totalGames: matcheHome.length + matcheAway.length,
  totalVictories: (totalVLD(matcheHome, arrayGoals).victories
    + totalVLD(matcheAway, arrayGoals2).victories),
  totalDraws: (totalVLD(matcheHome, arrayGoals).draws
    + totalVLD(matcheAway, arrayGoals2).draws),
  totalLosses: (totalVLD(matcheHome, arrayGoals).losses
    + totalVLD(matcheAway, arrayGoals2).losses),
  goalsFavor: goalsCounter(matcheHome, arrayGoals[0]) + goalsCounter(matcheAway, arrayGoals[1]),
  goalsOwn: goalsCounter(matcheHome, arrayGoals[1]) + goalsCounter(matcheAway, arrayGoals[0]),
  goalsBalance: goalsBalanceCouter(matcheHome, arrayGoals)
    + goalsBalanceCouter(matcheAway, arrayGoals2),
  efficiency: efficiencyAll(matcheHome, matcheAway),
});

export const orderResults = (teams: ITeamLeaderboard[]) =>
  teams.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return a.goalsOwn - b.goalsOwn;
  });
