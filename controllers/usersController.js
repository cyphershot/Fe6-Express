const users = require("../schemas/userSchema");

// register logic

exports.userRegister = async (req,res)=>{

    console.log(req.file);

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