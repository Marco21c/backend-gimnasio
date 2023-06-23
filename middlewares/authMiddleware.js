exports.authorize = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.usuario.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  };
};














  
  