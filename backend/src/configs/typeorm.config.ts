import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
// import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: '.env' });

// const config = {
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    // migrationsTableName: 'migrations',
    // migrations: ['src/migrations/*.ts'],
    // cli: {
    //     migrationsDir: 'src/migrations',
    // },
    autoLoadEntities: true,
    synchronize: true,
};

// export default registerAs('typeorm', () => config);
// export const connectionSource = new DataSource(config as DataSourceOptions);
// export const OrmConfig = {
//     ...typeOrmConfig,
//     migrationsTableName: 'migrations',
//     migrations: ['src/migrations/*.ts'],
//     cli: {
//         migrationsDir: 'src/migrations',
//     },
// };
// export default OrmConfig;
