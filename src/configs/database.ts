import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource, getDataSourceByName } from "typeorm-transactional";

export const DatabaseConfig = TypeOrmModule.forRootAsync({
    useFactory() {
        return {
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"],
            migrations: ["dist/src/database/migrations/*{.ts,.js}"],
            logging: process.env.APP_ENV == "local",
            synchronize: false,
            migrationsRun: true,
            migrationsTransactionMode: 'all',
            useUTC: true
        };
    },
    async dataSourceFactory(options) {
        const existingDataSource = getDataSourceByName('default');
        if (existingDataSource) {
            return existingDataSource;
        }

        const dataSource = new DataSource(options);
        return addTransactionalDataSource(dataSource);
    },
});

export const EprocDatabaseConfig = TypeOrmModule.forRootAsync({
    name: "eproc",
    useFactory: () => {
        return {
            name: "eproc",
            type: process.env.EPROC_DB_TYPE as any,
            host: process.env.EPROC_DB_HOST,
            port: +process.env.EPROC_DB_PORT,
            username: process.env.EPROC_DB_USER,
            password: process.env.EPROC_DB_PASSWORD,
            database: process.env.EPROC_DB_NAME,
            logging: process.env.APP_ENV == "local",
            synchronize: false,
            migrationsRun: false,
            options: {
                encrypt: false, // MSSQL-specific option
            },
        };
    },
    dataSourceFactory: async (options) => {
        return addTransactionalDataSource({
            name: options.name,
            dataSource: new DataSource(options),
        });
    }
});

export const CodaDatabaseConfig = TypeOrmModule.forRootAsync({
    name: "coda",
    useFactory: () => {
        return {
            name: "coda",
            type: process.env.CODA_DB_TYPE as any,
            host: process.env.CODA_DB_HOST,
            port: +process.env.CODA_DB_PORT,
            username: process.env.CODA_DB_USER,
            password: process.env.CODA_DB_PASSWORD,
            database: process.env.CODA_DB_NAME,
            logging: process.env.APP_ENV == "local",
            synchronize: false,
            migrationsRun: false,
            options: {
                encrypt: false, // MSSQL-specific option
            },
        };
    },
    dataSourceFactory: async (options) => {
        return addTransactionalDataSource({
            name: options.name,
            dataSource: new DataSource(options),
        });
    }
});