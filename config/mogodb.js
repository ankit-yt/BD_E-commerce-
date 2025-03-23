const mongoose = require("mongoose")
const connectDB = ()=>{
    try{
        mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB Connected"))
      
    }
    catch(e){
        console.log(e.message)
    }

}

module.exports = connectDB