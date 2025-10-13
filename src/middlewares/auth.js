import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, authConfig.secret);

    req.userId = decoded.id; // Se quiser usar o ID depois
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

export default authMiddleware;
