const express = require('express')
const router = new express.Router()

const userController = require('../controllers/usersController')
const upload = require('../multerConfig/storageMulter')


// register

router.post('/employee/register',upload.single('user_profile'),userController.userRegister)

// get all users
router.get('/get-all-employees',userController.getallusers)

// get user details
router.get('/employee/view/:id',userController.getuserdetail)

// edit user 
// router.put('/employee/edit/:id',userController.editUser)



module.exports = router 

