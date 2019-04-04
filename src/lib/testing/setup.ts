import { AddressInfo } from 'net';
import app from '../../app';

export const setup = async () => {
  const server = await app.start();
  const { port } = server.address() as AddressInfo;
  console.log(port);

  process.env.TEST_HOST = `http://localhost:${port}/graphql`;
};
