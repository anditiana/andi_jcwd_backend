const db = require('../models');
const user = db.account;

const authlogin= {
  keeplogin: async (req, res) => {
    const test = req.user;
    try {
        const result = await user.findOne({
            where: {
                id: req.user.id
            }
        })
        const {id, username } = result;
        res.status(200).send({
          id : id,
          username : username
        })
    } catch (error) {
        res.status(400).send(error)
    }
  }
}

module.exports = authlogin;