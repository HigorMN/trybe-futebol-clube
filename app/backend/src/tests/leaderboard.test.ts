import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamsModel';

import { Model } from 'sequelize';
import Matches from '../database/models/MatchesModel';

chai.use(chaiHttp);

const { expect, request } = chai;

const mockListTeam: Team[] = [
  new Team({ id: 1, teamName: 'Flamengo' }),
  new Team({ id: 2, teamName: 'Cruzeiro' }),
];

const mockListMatche: Matches[] = [
  new Matches({
    id: 1,
    homeTeamId: 1,
    homeTeamGoals: 2,
    awayTeamId: 2,
    awayTeamGoals: 1,
    inProgress: false,
  }),
  new Matches({
    id: 2,
    homeTeamId: 2,
    homeTeamGoals: 1,
    awayTeamId: 1,
    awayTeamGoals: 2,
    inProgress: false,
  }),
];

const mockResult = [
  {
    name: 'Flamengo',
    totalPoints: 3,
    totalGames: 1,
    totalVictories: 1,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 2,
    goalsOwn: 1,
    goalsBalance: 1,
    efficiency: '100.00',
  },
  {
    name: 'Cruzeiro',
    totalPoints: 0,
    totalGames: 1,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 1,
    goalsFavor: 1,
    goalsOwn: 2,
    goalsBalance: -1,
    efficiency: '0.00',
  },
];

describe('Teste da aplicação: GET /leaderboard/home', () => {
  beforeEach(sinon.restore);
  it('Deve os melhores times em casa', async () => {
    sinon
      .stub(Model, 'findAll')
      .onFirstCall()
      .resolves(mockListTeam)
      .onSecondCall()
      .resolves(mockListMatche);
    const result = await request(app).get('/leaderboard/home');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal(mockResult);
  });
});
