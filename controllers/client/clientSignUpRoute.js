const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../../schemas/client');
const { getRouteByKey } = require('../../routes/routes');
const nodemailer = require('nodemailer');
const {EMAIL, PASSWORD} = require('../../mailEnv')
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

      // Send email
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      const message = {
        from: '"Fred Foo 👻" <foo@example.com>',
        to: email,
        subject: "Welcome to our platform",
        text: "Successfully Register with us",
        html: "<b>Thank you for signing up!</b>",
      };

      transporter.sendMail(message, (error, info) => {
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

    const {userEmail} = req.body;

    let config = {
      service : 'gmail',
      auth : {
        user: EMAIL,
        pass: PASSWORD
      }

    }

    let transporter = nodemailer.createTransport(config)

    let MailGenerator = new Mailgen({
      theme: "default",
      product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
      }
    })

    let response= {
      body:{
        name: "ajml test",
        intro: "Your bill has arrived!",
        table: {
          data: [
          { 
             item : "Nodemailer",
            description:"A Backend application",
          }

          ]
        },
        outro: "Look forward to do more business"
      }
    }

    let mail = MailGenerator.generate(response)

    let message = {
      from : EMAIL,
      to : userEmail,
      subject: "Place Order",
      html:mail
    }

    transporter.sendMail(message).then(()=>{
      return res.status(201).json({
        msg:"you should receieve an email"
      })
    }).catch(error => {
      return res.status(500).json({error})
    })


    // res.status(201).json("Mail sent successfully");
  },
};

module.exports = { clientSignUpRoute, mailRoute };
