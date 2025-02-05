import { Sequelize } from "sequelize";
import pg from "pg";

export const createDatabaseIfNotExists = async (config) => {
  try {
    // Connect without specifying a database
    const tempSequelize = new Sequelize({
      dialect: "postgres",
      username: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      dialectModule: pg,
      logging: false, // Disable logging
    });

    // Check if the database exists
    const [results] = await tempSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${config.database}';`
    );

    if (results.length === 0) {
      console.log(`Database ${config.database} does not exist. Creating...`);
      await tempSequelize.query(`CREATE DATABASE "${config.database}";`);
      console.log(`Database ${config.database} created successfully.`);
    } else {
      console.log(`Database ${config.database} already exists.`);
    }

    await tempSequelize.close();
  } catch (error) {
    console.error("Error checking/creating database:", error);
    process.exit(1);
  }
};
