import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

const generateToken = (req, res) => {
    const accessToken = process.env.ACCESS_TOKEN_SECRET;

    const user = req.body;

    const token = jwt.sign(
        user,
        accessToken,
        { expiresIn: '24h' });

    

    res.send({token});
}

export { generateToken };