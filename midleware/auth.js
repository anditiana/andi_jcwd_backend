const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken : (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const verifiedToken = jwt.verify(token, process.env.KEY_TOKEN_CREDENTIAL);
      req.user = verifiedToken;
      next();
    } catch (error) {
      res.status(500).send(error);      
    }
  },
}