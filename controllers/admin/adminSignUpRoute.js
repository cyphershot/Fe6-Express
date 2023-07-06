const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminClient = require('../../schemas/admin');
const { getRouteByKey } = require('../../routes/routes');

const adminSignUpRoute = {
  path: getRouteByKey('adminSignUp'),
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;
    try {
      await AdminClient.findOne({ email });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await AdminClient.create({ email, password: passwordHash, isAdmin: true });

      const { _id, email: savedEmail, isAdmin } = newUser;
      jwt.sign(
        {
          id: _id,
          savedEmail,
          isAdmin,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '10m',
        },
        (err, token) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(200).json({ token });
        }
      );
    } catch (error) {
      if (error.constructor.name === 'MongoServerError' && error.code === 11000) {
        return res.status(409).json({ response: 'User already exits' });
      }
      return res.status(500).json({ response: 'Internal server error' });
    }
  },
};

module.exports = { adminSignUpRoute };