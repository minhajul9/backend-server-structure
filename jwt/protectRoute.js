import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

export const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).send({ timeOut: true, error: true, message: 'unauthorized access' });
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {

        if (error) {
            return res.send({ timeOut: true, error: true, message: 'Session Time out.' });
        }
        req.decoded = decoded;
        next();
    })
}


export const verifyAdmin = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ timeOut: true, error: true, message: 'unauthorized access' });
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ timeOut: true, error: true, message: 'unauthorized access. Try Login again.' });
        }
        if (decoded.userType === 'admin') {
            req.decoded = decoded
            next();
        }
        else {
            res.send({ error: true, message: 'Unauthorized access.' })
        }

    })
}

