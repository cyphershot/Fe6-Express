const express = require('express');
const router = express.Router();
const collection = require('../mongo');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json('exist');
    } else {
      res.json('notexist');
    }
  } catch (e) {
    res.json('fail');
  }
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: password,
  };

  try {
    // const check=await collection.findOne({email:email})

    const userExist = await collection.findOne({ email: email });

    if (!userExist) {
      await collection.insertMany([data]);
      res.json('User created sucessfully');
    } else {
      //
    }

    // if(check){
    //     res.json("exist")
    // }
    // else{
    //     res.json("notexist")
    //     await collection.insertMany([data])
    // }
  } catch (e) {
    console.log('Error', e);
    res.json('fail');
  }
});

module.exports = router;