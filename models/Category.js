const mongoose = require('mongoose');
const Joi = require('joi');
const categoryschema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        title:{
            type: String,
            required:true,
            trim:true,
        },
        username:{
            type:String,
        }    
    },
    {
        timestamps:true,
    }
);
//  Category model
const Category = mongoose.model("Category",categoryschema);
// vaildate create Comment 
function vaildateCreateCategory(obj) {
    const Schema = Joi.object({
        title:Joi.string().trim().required(),
    })
    return Schema.validate(obj);
}
module.exports = {
    Category,
    vaildateCreateCategory,
}