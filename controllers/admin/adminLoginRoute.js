const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getRouteByKey } = require('../../routes/routes');
const AdminClient = require('../../schemas/admin');

const adminLoginRoute = {
  path: getRouteByKey('adminLogIn'),
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    try {
      const adminUser = await AdminClient.findOne({ email }).exec();

      if (!adminUser) return res.status(401).json({ response: 'User not found' });

      const { _id: id, password: passwordHash, isAdmin } = adminUser;
      const verifyAdminPassword = await bcrypt.compare(password, passwordHash);

      if (verifyAdminPassword) {
        jwt.sign({ id, password, isAdmin }, process.env.JWT_SECRET, { expiresIn: '5m' }, (error, token) => {
          if (error) {
            res.status(500).json(error);
          }
          res.status(200).json({ token });
        });
      } else {
        res.status(401).json({ response: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
};

module.exports = { adminLoginRoute };