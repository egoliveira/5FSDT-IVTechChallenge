import dotenv from 'dotenv';

dotenv.config();

interface Config {
    host: string;
    port: number;
    nodeEnv: string;
    databaseUser: string;
    databasePassword: string;
    databaseName: string;
    databaseHost: string;
    databasePort: number;
    databaseURL: string;
    jwtSecret: string;
}

const DEFAULT_DATABASE_USER = 'sb';
const DEFAULT_DATABASE_HOST = 'localhost';
const DEFAULT_DATABASE_PORT = 5432;
const DEFAULT_DATABASE_NAME = 'schola_blog';

const config: Config = {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUser: process.env.DATABASE_USER || DEFAULT_DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD || '',
    databaseName: process.env.DATABASE_NAME || DEFAULT_DATABASE_NAME,
    databaseHost: process.env.DATABASE_HOST || DEFAULT_DATABASE_HOST,
    databasePort: parseInt(process.env.DATABASE_PORT || `${DEFAULT_DATABASE_PORT}`),
    databaseURL: process.env.DATABASE_URL || `postgres://${DEFAULT_DATABASE_USER}@${DEFAULT_DATABASE_HOST}:${DEFAULT_DATABASE_PORT}/${DEFAULT_DATABASE_NAME}`,
    jwtSecret: process.env.JWT_SECRET || 'JWT_SECRET',
};

export default config;
