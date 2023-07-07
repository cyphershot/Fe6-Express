const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../../schemas/client');
const { getRouteByKey } = require('../../routes/routes');
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../../mailEnv');
const Mailgen = require('mailgen');

const clientSignUpRoute = {
  path: getRouteByKey('clientSignUp'),
  method: 'post',
  handler: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingClient = await Client.findOne({ email });

      if (existingClient) {
        return res.status(409).json({ response: 'User already exists' });
      }

      // Create user
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Client.create({ email, password: passwordHash });

      // Send email to admin
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: PASSWORD
        }
      });

      const mailOptions = {
        from: EMAIL,
        to: 'admin@example.com', // Replace with your admin email address
        subject: 'New User Sign Up',
        text: `A new user signed up with the email: ${email}`,
        attachments: [
          {
            filename: 'attachment.png', // Replace with your desired filename
            path: '/path/to/attachment.png' // Replace with the path to your image file
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email to admin:', error);
        } else {
          console.log('Email sent to admin:', info.messageId);
        }
      });

      // Send email to user
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'Your Product',
          link: 'https://yourproduct.com'
        }
      });

      const response = {
        body: {
          name: 'John Doe', // Replace with the user's name
          intro: 'Welcome to our platform!',
          outro: 'Thank you for signing up.'
        }
      };

      const emailBody = mailGenerator.generate(response);
      const emailMessage = {
        from: EMAIL,
        to: email,
        subject: 'Welcome to Our Platform',
        html: emailBody,
        attachments: [
          {
            filename: 'attachment.png', // Replace with your desired filename
            path: '/path/to/attachment.png' // Replace with the path to your image file
          }
        ]
      };

      transporter.sendMail(emailMessage, (error, info) => {
        if (error) {
          console.log('Error sending email to user:', error);
          return res.status(500).json({ response: 'Failed to send email to user' });
        }

        console.log('Email sent to user:', info.messageId);
        return res.status(201).json({
          msg: 'You should receive an email',
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info)
        });
      });

      // Generate token
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
        return res.status(409).json({ response: 'User already exists' });
      }
      return res.status(500).json({ response: 'Internal server error' });
    }
  },
};

// send mail from real gmail account
const mailRoute = {
  path: getRouteByKey('clientMail'),
  method:'post',
  handler: async (req, res) => {
    const { userEmail } = req.body;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    });

    let mailOptions = {
      from: EMAIL,
      to: userEmail,
      subject: 'Place Order',
      text: 'Please place your order.',
      attachments: [
        {
          filename: 'attachment.png', // Replace with your desired filename
          path: '/path/to/attachment.png' // Replace with the path to your image file
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ response: 'Failed to send email' });
      }
      
      console.log('Email sent:', info.messageId);
      return res.status(201).json({
        msg: 'You should receive an email',
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info)
      });
    });
  },
};

module.exports = { clientSignUpRoute, mailRoute };
