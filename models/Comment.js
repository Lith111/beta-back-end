const mongoose = require('mongoose');
const Joi = require('joi');
const commentschema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Post",
            required:true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        text:{
            type: String,
            required:true
        },
        username:{
            type:String,
            required:true,
        }    
    },
    {
        timestamps:true,
    }
);
//  Commment model
const Comment = mongoose.model("Comment",commentschema);
// vaildate create Comment 
function vaildateCreateComment(obj) {
    const Schema = Joi.object({
        postId : Joi.string().required(),
        text:Joi.string().trim().required(),
    })
    return Schema.validate(obj);
}
// vaildate update Comment 
function vaildateUpdateComment(obj) {
    const Schema = Joi.object({
        text:Joi.string().trim().required(),
    })
    return Schema.validate(obj);
}
module.exports = {
    Comment,
    vaildateCreateComment,
    vaildateUpdateComment
}