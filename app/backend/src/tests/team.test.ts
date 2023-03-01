import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamsModel';

import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect, request } = chai;

describe('Teste da aplicação: Buscar pelos times', () => {
  beforeEach(sinon.restore);

  const listMock: TeamModel[] = [
    new TeamModel({ id: 1, teamName: 'Flamengo', }),
    new TeamModel({ id: 2, teamName: 'Cruzeiro', }),
  ];
  
  const listMock2 = [
    { id: 1, teamName: 'Flamengo', },
    { id: 2, teamName: 'Cruzeiro', },
  ];

  it('Deve retornar todos os times', async () => {
    sinon.stub(Model, 'findAll').resolves(listMock);
    const result = await request(app).get('/teams');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal(listMock2);
  });

  it('Deve retornar apenas um time', async () => {
    sinon.stub(Model, 'findByPk').resolves(listMock[0]);
    const result = await request(app).get('/teams/1');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal(listMock2[0]);
  });
});
