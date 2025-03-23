const userModel = require("../models/user")
const jwt = require("jsonwebtoken")
const blackListModel = require("../models/blackList")

module.exports.isAuthenicated = async (req ,res , next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isBlackList = await blackListModel.findOne({token})
        if(isBlackList){
            return res.status(403).json({msg: "Unauthorized"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id)
        if(!user){
            return res.status(401).json({
                message:"unauthorized"
            })
        }
        req.user = user
        next()


    }catch(e){
        next(e)
    }
}

module.exports.isSeller = async (req , res , next) =>{
    try{
        const user = req.user;
        if(user.role !== "seller"){
            return res.status(401).json({
                message:"unauthorized"
            })
           
        }
        next()
        console.log("yes i am seller")
    }catch(e){
        next(e)
    }
}