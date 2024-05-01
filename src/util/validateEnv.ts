import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  PORT: port(),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_DIALECT: str(),
  DB_NAME: str(),
});
