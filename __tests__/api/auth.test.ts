import 'reflect-metadata';
import faker from 'faker';
import requset from 'supertest';
import { Connection, getRepository } from 'typeorm';
import server from '../../src/app';
import User from '../../src/database/entity/User';
import { createTestConnection } from '../../src/database/db';
import Certification from '../../src/database/entity/Certification';
import UserProfile from '../../src/database/entity/UserProfile';

faker.seed(Date.now() + 5);
const username = faker.internet.userName();
const email = faker.internet.email();
const password = faker.internet.password();

jest.useFakeTimers();
Date.now = jest.fn(() => 1503187200000);

let conn: Connection;
beforeAll(async () => {
  conn = await createTestConnection();
});
afterAll(async () => {
  conn.close();
});

describe('LocalRegister API', () => {
  it('<200> should always return access, refresh token and return user information', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/register/local')
      .send({
        username: username,
        email: email,
        password: password,
        short_bio: '간단한 소개를 하겠습니다.'
      })
      .expect(200);

    expect(response.status).toEqual(200);
    expect(response.body.ok).toEqual(true);
    expect(response.body.error).toEqual(null);
    const expected = ['user', 'access_token', 'refresh_token'];
    expect(Object.keys(response.body.payload)).toEqual(expect.arrayContaining(expected));
  });

  it('<400> requset bodyData validateError', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/register/local')
      .send({
        username: 123123,
        email: email,
        password: password,
        short_bio: '간단한 소개'
      })
      .expect(400);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(400);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });

  it('<409> User Data Duplicated account', async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test@naver.com';
    user.username = 'test';
    user.password = '123123';
    await userRepo.save(user);

    const response = await requset(server.callback())
      .post('/api/v1/auth/register/local')
      .send({
        username: 'test',
        email: 'test@naver.com',
        password: '123123',
        short_bio: '간단한 소개'
      })
      .expect(409);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(409);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });
});

describe('CheckExists API', () => {
  it('<200> (email) Checks whether the input value already exists and returns the result', async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test1@naver.com';
    user.username = 'test1';
    user.password = '123123';
    await userRepo.save(user);

    const response = await requset(server.callback())
      .get('/api/v1/auth/exists/email/test1@naver.com')
      .expect(200);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(200);
    expect(ok).toEqual(true);
    expect(error).toEqual(null);
    const expected = ['exists'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected));
  });

  it('<200> (username) Checks whether the input value already exists and returns the result', async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test2@naver.com';
    user.username = 'test2';
    user.password = '123123';
    await userRepo.save(user);

    const response = await requset(server.callback())
      .get('/api/v1/auth/exists/username/test2')
      .expect(200);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(200);
    expect(ok).toEqual(true);
    expect(error).toEqual(null);
    const expected = ['exists'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected));
  });
});

describe('SendEmail API', () => {
  it('<200> Email Authenticated Mail', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/sendEmail')
      .send({
        email: email
      })
      .expect(200);

    const { ok, error, payload } = response.body;
    expect(response.status).toEqual(200);
    expect(ok).toEqual(true);
    expect(error).toEqual(null);
    const expected = ['code'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected));
  });

  it('<400> requset bodyData validateError', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/sendEmail')
      .send({
        email: '123123'
      })
      .expect(400);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(400);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });
});

describe('SendEmail Code Check API', () => {
  it('<409> Email Code Duplicated', async () => {
    const certification = new Certification();
    certification.code = 'A6672vT6C';
    certification.platform = 'EMAIL';
    certification.email = 'mins5190@naver.com';
    certification.save();

    const response = await requset(server.callback())
      .get('/api/v1/auth/sendEmail/check/123test123')
      .expect(409);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(409);
    expect(ok).toEqual(false);
    const expected_payload = ['exists'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected_payload));
    const expected_error = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected_error));
  });

  it('<200> Email Code Check', async () => {
    const certification = new Certification();
    certification.code = 'A6672vT6C';
    certification.platform = 'EMAIL';
    certification.email = 'mins5190@naver.com';
    certification.save();

    const response = await requset(server.callback())
      .get('/api/v1/auth/sendEmail/check/A6672vT6C')
      .expect(200);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(200);
    expect(ok).toEqual(true);
    expect(error).toEqual(null);
    const expected = ['exists'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected));
  });
});

describe('LocalLogin API', async () => {
  it('<200> should always return access, refresh token and return user information', async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test3@naver.com';
    user.username = 'test3';
    user.password = '123123';
    await userRepo.save(user);

    const profileRepo = getRepository(UserProfile);
    const profile = new UserProfile();
    profile.fk_user_id = user.id;
    profile.short_bio = '간단한 소개입니다';
    await profileRepo.save(profile);

    const response = await requset(server.callback())
      .post('/api/v1/auth/login/local')
      .send({
        email: 'test3@naver.com',
        password: '123123'
      })
      .expect(200);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(200);
    expect(ok).toEqual(true);
    expect(error).toEqual(null);
    const expected = ['user', 'access_token', 'refresh_token'];
    expect(Object.keys(payload)).toEqual(expect.arrayContaining(expected));
  });

  it('<403> if the user does not exist', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/login/local')
      .send({
        email: 'test4@naver.com',
        password: '123123'
      })
      .expect(403);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(403);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });

  it("<403> if the user's password does not match", async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test4@naver.com';
    user.username = 'test4';
    user.password = '123123';
    await userRepo.save(user);

    const response = await requset(server.callback())
      .post('/api/v1/auth/login/local')
      .send({
        email: 'test4@naver.com',
        password: '123123123'
      })
      .expect(403);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(403);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });

  it("<401> if the user's profile data model does not exist", async () => {
    const userRepo = getRepository(User);
    const user = new User();
    user.email = 'test5@naver.com';
    user.username = 'test5';
    user.password = '123123';
    await userRepo.save(user);

    const response = await requset(server.callback())
      .post('/api/v1/auth/login/local')
      .send({
        email: 'test5@naver.com',
        password: '123123'
      })
      .expect(401);

    const { error, payload, ok } = response.body;
    expect(response.status).toEqual(401);
    expect(ok).toEqual(false);
    const expected = ['name', 'message'];
    expect(Object.keys(error)).toEqual(expect.arrayContaining(expected));
    expect(payload).toEqual(null);
  });
});

describe('LogOut API', () => {
  it('<200> user logout', async () => {
    const response = await requset(server.callback())
      .post('/api/v1/auth/logout')
      .expect(200);

    expect(response.status).toEqual(200);
  });
});
