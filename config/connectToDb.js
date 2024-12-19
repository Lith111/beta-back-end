const mongoose = require('mongoose');
require('dotenv').config();
module.exports = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("conenect to moongo db ^__^");
    }catch(error){

        console.log(error);
    }
}