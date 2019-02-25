import 'reflect-metadata';
import requset from 'supertest';
import server from '../../src/app';

describe('creatix server version check', () => {
  jest.useFakeTimers();
  Date.now = jest.fn(() => 1503187200000);
  it('GET /api/v1/version/check', async () => {
    const response = await requset(server.callback()).get('/api/v1/version/check');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('v1');
  });
});
