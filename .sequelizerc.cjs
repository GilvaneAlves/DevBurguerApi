import { resolve } from 'node:path';

export default {
  config: resolve('src', 'config', 'database.cjs'),
  'migrations-path': resolve('src', 'database', 'migrations'),
  'models-path': resolve('src', 'app', 'models'),
};
