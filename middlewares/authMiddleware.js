// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ status: 401, message: 'Token ausente ou malformado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { sub: userId, email, iat, exp }
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ status: 401, message: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
