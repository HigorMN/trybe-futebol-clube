import IGoalsMatches from './IGoalsMatches';

export default interface ICreateMatches extends IGoalsMatches {
  homeTeamId: number;
  awayTeamId: number;
}
