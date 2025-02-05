import dotenv from 'dotenv';
import pg from "pg"

dotenv.config();

export default {
    development: {
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectModule: pg,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
        // logging: false,
        dialectOptions: {
            connectTimeout: 30000, // 30 seconds
        },
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectModule: pg,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
        // logging: false,
        dialectOptions: {
            connectTimeout: 30000, // 30 seconds
        },
    }
};
