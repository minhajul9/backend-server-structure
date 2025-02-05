import express, { json } from 'express';
import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import db from './models/index.js';
import { createAdmin } from './script/createAdmin.js';

import authRoutes from './routes/auth.route.js'
import jwtRoutes from './routes/jwt.route.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(json());


app.use('/api/auth', authRoutes);
app.use('/api/jwt', jwtRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')))

app.get('/', (req, res)=>{
    res.send('hello')
})


app.listen(port, () => {
    try {
        db.sequelize.sync()
            .then(async () => {


                await createAdmin();
                // await createContactInfo()
            })
            .catch((err) => {
                console.error('Error syncing database:', err);
            });
        console.log("EGO server running on port: ", port)
    } catch (error) {

    }
})