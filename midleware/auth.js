const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken : (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const verifiedToken = jwt.verify(token, 'testing123');
      req.user = verifiedToken;
      next();
    } catch (error) {
      res.status(500).send(error);      
    }
  },
}