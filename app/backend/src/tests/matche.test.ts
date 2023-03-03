import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Model } from 'sequelize';
import Matches from '../database/models/MatchesModel';
import Teams from '../database/models/TeamsModel';
const JWT_SECRET = process.env.JWT_SECRET as string;

chai.use(chaiHttp);

const { expect, request } = chai;

const listMock: Matches[] = [
  new Matches({
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
      teamName: 'São Paulo',
    },
    awayTeam: {
      teamName: 'Grêmio',
    },
  }),
  new Matches({
    id: 2,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: true,
    homeTeam: {
      teamName: 'Flamengo',
    },
    awayTeam: {
      teamName: 'Cruzeiro',
    },
  }),
];

const listMockTeam: Teams[] = [
  new Teams({ id: 1, teamName: 'Flamengo' }),
  new Teams({ id: 2, teamName: 'Cruzeiro' }),
];

const listMock2 = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
  },
  {
    id: 2,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: true,
  },
];

const user = {
  id: 1,
  username: 'Higor Maranhão',
  role: 'admin',
  email: 'higor.maranhao2000@gmail.com',
};

describe('Teste da aplicação: GET /matches', () => {
  beforeEach(sinon.restore);

  it('Deve retornar todos as partidas', async () => {
    sinon.stub(Model, 'findAll').resolves(listMock);
    const result = await request(app).get('/matches');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal(listMock2);
  });
});

describe('Teste da aplicação: GET /matches?inProgress=', () => {
  beforeEach(sinon.restore);

  it('Deve retornar todos as partidas em Progresso', async () => {
    sinon.stub(Model, 'findAll').resolves([listMock[1]]);
    const result = await request(app).get('/matches?inProgress=true');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal([listMock2[1]]);
  });

  it('Deve retornar todos as partidas finalizadas', async () => {
    sinon.stub(Model, 'findAll').resolves([listMock[0]]);
    const result = await request(app).get('/matches?inProgress=false');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal([listMock2[0]]);
  });
});

describe('Teste da aplicação: PATCH /matches/:id/finish', () => {
  beforeEach(sinon.restore);

  it('Deve finalizar a partida', async () => {
    const token = jwt.sign(user, JWT_SECRET);

    sinon.stub(Model, 'update').resolves([1]);
    const result = await request(app)
      .patch('/matches/1/finish')
      .set('Authorization', token);

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal({ message: 'Finished' });
  });
});

describe('Teste da aplicação: PATCH /matches/:id', () => {
  beforeEach(sinon.restore);

  it('Deve atualizar os gols', async () => {
    const token = jwt.sign(user, JWT_SECRET);

    sinon.stub(Model, 'update').resolves([1]);
    const result = await request(app)
      .patch('/matches/1')
      .set('Authorization', token);

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal({ message: 'updated goals' });
  });
});

describe('Teste da aplicação: POST /matches', () => {
  beforeEach(sinon.restore);

  it('Deve criar partida', async () => {
    sinon
      .stub(Model, 'findByPk')
      .onFirstCall()
      .resolves(listMockTeam[0])
      .onSecondCall()
      .resolves(listMockTeam[1]);
    sinon.stub(Model, 'create').resolves(listMock[1]);

    const token = jwt.sign(user, JWT_SECRET);
    const result = await request(app)
      .post('/matches')
      .send({ homeTeamId: 16, awayTeamId: 8 })
      .set('Authorization', token);

    expect(result.status).to.be.equal(201);
    expect(result.body).to.deep.equal(listMock2[1]);
  });

  it('Deve retornar um erro quando criar partida com o mesmo time', async () => {
    sinon
      .stub(Model, 'findByPk')
      .onFirstCall()
      .resolves(listMockTeam[0])
      .onSecondCall()
      .resolves(listMockTeam[0]);
    sinon.stub(Model, 'create').resolves(listMock[1]);

    const token = jwt.sign(user, JWT_SECRET);
    const result = await request(app)
      .post('/matches')
      .send({ homeTeamId: 16, awayTeamId: 16 })
      .set('Authorization', token);

    expect(result.status).to.be.equal(422);
    expect(result.body).to.deep.equal({
      message: 'It is not possible to create a match with two equal teams',
    });
  });

  it('Deve retornar um erro caso o time de casa não existe', async () => {
    sinon
      .stub(Model, 'findByPk')
      .onFirstCall()
      .resolves(null)
      .onSecondCall()
      .resolves(listMockTeam[0]);
    sinon.stub(Model, 'create').resolves(listMock[1]);

    const token = jwt.sign(user, JWT_SECRET);
    const result = await request(app)
      .post('/matches')
      .send({ homeTeamId: 99, awayTeamId: 16 })
      .set('Authorization', token);

    expect(result.status).to.be.equal(404);
    expect(result.body).to.deep.equal({
      message: 'There is no team with such id!',
    });
  });

  it('Deve retornar um erro caso o time de fora não existe', async () => {
    sinon
      .stub(Model, 'findByPk')
      .onFirstCall()
      .resolves(listMockTeam[0])
      .onSecondCall()
      .resolves(null);
    sinon.stub(Model, 'create').resolves(listMock[1]);

    const token = jwt.sign(user, JWT_SECRET);
    const result = await request(app)
      .post('/matches')
      .send({ homeTeamId: 16, awayTeamId: 99 })
      .set('Authorization', token);

    expect(result.status).to.be.equal(404);
    expect(result.body).to.deep.equal({
      message: 'There is no team with such id!',
    });
  });
});
