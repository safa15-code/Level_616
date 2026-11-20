const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';           // looks like "Bearer <token>"
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id; // checks signature + expiry
    next();                                                    // let the request continue
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};