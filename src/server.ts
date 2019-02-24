import dotenv from 'dotenv';
import app from './app';
import { normalizePort } from './lib/utils';
dotenv.config();

const { PORT } = process.env;
const port = normalizePort(PORT || 6000);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} ✅`);
});
