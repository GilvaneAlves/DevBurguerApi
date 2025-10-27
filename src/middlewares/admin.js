const adminMiddleware = (req, res, next) => {
  const isUserAdmin = req.userIsAdmin;

  if (!isUserAdmin) {
    return res.status(403).json({ error: 'Access denied: admin only' });
  }

  return next();
};

export default adminMiddleware;
