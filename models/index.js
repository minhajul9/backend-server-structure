// import { Sequelize } from 'sequelize';

// import config from '../database/config.js';

// import userModel from './user.model.js';
// import questionModel from './question.model.js';
// import optionModel from './option.model.js';


// const env = process.env.NODE_ENV || 'development';
// const sequelize = new Sequelize(config[env]);


// const User = userModel(sequelize);
// const Question = questionModel(sequelize);
// const Option = optionModel(sequelize);



// const models = {
//     User,
//     Question,
//     Option
// }


// Object.values(models).forEach((model) => {
//     if (model.associate) {
//         model.associate(models)
//     }
// });


// const db = {
//     ...models,
//     sequelize,
//     Sequelize,
// };


// export default db;


import { Sequelize } from "sequelize";
import { createDatabaseIfNotExists } from "../database/createDatabase.js"; // Import helper function
import config from "../database/config.js";

import userModel from "./user.model.js";

const env = process.env.NODE_ENV || "development";

// Create the database automatically
await createDatabaseIfNotExists(config[env]);

const sequelize = new Sequelize(config[env]);

const User = userModel(sequelize);

const models = {
  User,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const db = {
  ...models,
  sequelize,
  Sequelize,
};

export default db;
