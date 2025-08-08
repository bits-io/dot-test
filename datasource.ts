import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config({ path: resolve(__dirname, '.env') });

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: +process.env['DB_PORT'],
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  migrationsTransactionMode: 'all',
  logging: process.env.APP_ENV === 'local',
  seeds: ['dist/src/database/seeds/*{.ts,.js}'],
};

const _ds = new DataSource(options);

export default _ds;