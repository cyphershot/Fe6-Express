const users = require("../schemas/userSchema");

// register logic

exports.userRegister = async (req,res)=>{

    console.log(req.file);
    // to get image url

    const file = req.file.filename

    const {customerName,companyName,email,contactNumber,GSTNumber,requireService,qty, orderValue} = req.body
    if(!customerName || !companyName || !email || !contactNumber || !GSTNumber || !requireService || !qty || !orderValue )
    {
        res.status(403).json("All inputs are required!!!")
    }
    try{
           const preuser = await users.findOne({email})
           if(preuser){
              res.status(403).json("The user already exist in our database....")
           }
           else{
                 const newuser = new users({
                    customerName,
                    companyName,
                    email,
                    contactNumber,
                    GSTNumber,
                    requireService,
                    qty,
                    orderValue,
                    profile:file
                 })

                 await newuser.save()
                 res.status(200).json(newuser)
           }
    }
    catch(error){
        res.status(401).json(error)
    }

}

// get all users
exports.getallusers = async (req,res)=>{
    try{
        const userdata  = await users.find()
        res.status(200).json(userdata)
    } catch(error){
        res.status(401).json(error)
    }
}


// get a user

exports.getuserdetail = async (req,res)=>{
    const {id} = req.params
    try{
        const userdata  = await users.findOne({_id:id})
        if(userdata){
            res.status(200).json(userdata)
        }else{
            res.status(404).json("User doesnot exist!")
        }
      
    }catch(error){
        res.status(401).json(error)
    }
}

// editUser
// exports.editUser =  async (req,res)=>{
//     const {id} =  req.params
//     const {customerName,companyName,email,contactNumber,GSTNumber,requireService,qty, orderValue,user_profile} = req.body
//      // to get image url

//      const file = req.file ? req.file.filename: user_profile

//      try{
//              const updateUser = await users.findByIdAndUpdate({_id:id},{
//                 customerName,companyName,email,contactNumber,GSTNumber,requireService,qty,orderValue,profile:file
//              },{
//                 new:true
//              })

//      }catch(error){
//         res.status(401).json(error)
//     }

     

// }