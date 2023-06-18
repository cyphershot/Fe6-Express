const express = require('express')
const router = new express.Router()

const userController = require('../controllers/usersController')
const upload = require('../multerConfig/storageMulter')


// register

router.post('/employee/register',upload.single('user_profile'),userController.userRegister)

// get all users
router.get('/get-all-employees',userController.getallusers)





module.exports = router 

