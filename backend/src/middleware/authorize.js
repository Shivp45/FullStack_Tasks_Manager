const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. 'admin') or array ['admin','user']
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    // assume auth middleware ran already and set req.user
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient privileges' });
    }

    next();
  };
};

export default authorize;
