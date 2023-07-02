const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../../schemas/client');
const { getRouteByKey } = require('../../routes/routes');

const clientSignUpRoute = {
  path: getRouteByKey('clientSignUp'),
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    try {
      await Client.findOne({ email });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Client.create({ email, password: passwordHash });

      const { _id, email: savedEmail } = newUser;
      jwt.sign(
        {
          id: _id,
          savedEmail,
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

module.exports = { clientSignUpRoute };
