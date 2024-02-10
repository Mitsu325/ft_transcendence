import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    autoLoadEntities: true,
};

export const OrmConfig = {
    ...typeOrmConfig,
    migrationsTableName: 'migrations',
    migrations: ['src/migrations/*.ts'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};
export default OrmConfig;
