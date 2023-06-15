const express = require('express')
const router = new express.Router()

const userController = require('../controllers/usersController')
const upload = require('../multerConfig/storageMulter')


// register

router.post('/employee/register',upload.single('user_profile'),userController.userRegister)





module.exports = router 

