import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import Teams from './TeamsModel';

class Matches extends Model {
  declare readonly id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Matches.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  homeTeamId: {
    allowNull: false,
    type: INTEGER,
    field: 'home_team_id',
  },
  homeTeamGoals: {
    allowNull: false,
    type: INTEGER,
    field: 'home_team_goals',
  },
  awayTeamId: {
    allowNull: false,
    type: INTEGER,
    field: 'away_team_id',
  },
  awayTeamGoals: {
    allowNull: false,
    type: INTEGER,
    field: 'away_team_goals',
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
    field: 'in_progress',
  },
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'matches',
});

Matches.belongsTo(Teams, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Teams.hasMany(Matches, { foreignKey: 'homeTeamId', as: 'homeTeam' });

Matches.belongsTo(Teams, { foreignKey: 'awayTeamId', as: 'awayTeam' });
Teams.hasMany(Matches, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default Matches;
