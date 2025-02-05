import express from 'express'
import {generateToken} from '../jwt/generateToken.js';

const router = express.Router();

router.post('/create', generateToken)

export default router