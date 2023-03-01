import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';

import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect, request } = chai;

describe('Teste da aplicação: login', () => {
  beforeEach(sinon.restore);

  const user = new UserModel({
    id: 1,
    username: 'Higor Maranhão',
    role: 'admin',
    email: 'higor.maranhao2000@gmail.com',
    password: '123456'
  })

  it('Deve retornar um token JWT', async () => {
    const body = { email: 'higor.maranhao2000@gmail.com', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(200);
    expect(result.body).to.haveOwnProperty('token');
  });

  it('Deve retornar um erro caso não existir email', async () => {
    const body = { email: '', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Deve retornar um erro caso não existir password', async () => {
    const body = { email: 'higor.maranhao2000@gmail.com', password: ''}

    sinon.stub(Model, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(400);
    expect(result.body).to.deep.equal({ message: 'All fields must be filled'})
  });

  it('Deve retornar um erro caso email incorreto', async () => {
    const body = { email: 'emailIncorreto', password: '123456'}

    sinon.stub(Model, 'findOne').resolves(null);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

  it('Deve retornar um erro caso password incorreto', async () => {
    const body = { email: 'higor.maranhao2000@gmail.com', password: '12'}

    sinon.stub(Model, 'findOne').resolves(user);

    const result = await request(app).post('/login').send(body);

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Invalid email or password'})
  });

});
