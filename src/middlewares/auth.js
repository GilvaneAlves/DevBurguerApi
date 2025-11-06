import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

const authMidleware = (request, response, next) => {
    const authToken = request.headers.authorization
    if (!authToken) {
        return response.status(401).json({ err: 'No token provided' });
    }

    const token = authToken.split(' ')[1];

    try {
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                throw Error;
            }

            request.userId = decoded.id;
            request.userName = decoded.name;
            request.userIsAdmin = decoded.admin;
        });



    } catch (err) {
        return response.status(401).json({ err: 'Token invalid' });
    }
    return next();
}

export default authMidleware;