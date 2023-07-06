const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getRouteByKey } = require('../../routes/routes');
const Client = require('../../schemas/client');

const clientLoginRoute = {
  path: getRouteByKey('clientLoginIn'),
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Client.findOne({ email }).exec();

      if (!user) return res.status(401).json({ response: 'User not found' });

      const { _id: id, password: passwordHash } = user;
      const verifyPassword = await bcrypt.compare(password, passwordHash);

      if (verifyPassword) {
        jwt.sign({ id, password }, process.env.JWT_SECRET, { expiresIn: '5m' }, (error, token) => {
          if (error) {
            res.status(500).json(error);
          }
          res.status(200).json({ token });
        });
      } else {
        res.status(401).json({ response: 'Unauthorized' });
      }
    } catch (error) {
      res.sendStatus(500);
    }
  },
};

module.exports = { clientLoginRoute };