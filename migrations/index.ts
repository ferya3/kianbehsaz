import * as migration_20260917_195417_init from './20260917_195417_init';

export const migrations = [
  {
    up: migration_20260917_195417_init.up,
    down: migration_20260917_195417_init.down,
    name: '20260917_195417_init'
  },
];
