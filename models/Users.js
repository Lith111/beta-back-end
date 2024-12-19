const jwt = require("jsonwebtoken");
const joi = require("joi");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: false,
    },
    numberKey: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength:100,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default:false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    medicalPhoto: [{
      type: Object,
      default: {
        publicId: null,
      },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// connect the post for the user write this posts
UserSchema.virtual("posts",{
  ref:"Post",
  foreignField:"user",
  localField:"_id",
});
UserSchema.methods.generateAuthtoken = function(){
  return jwt.sign({id:this._id,isAdmin: this.isAdmin,isDoctor: this.isDoctor},process.env.JWT_SECRET)

}
// validate to register (مراقبة البيانات التي تأتي السيرفيرر )
const User = mongoose.model("User", UserSchema);
function validateRwgisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(2).max(100).required(),
    numberKey: joi.string().trim().min(2).max(100).required(),
    password: joi.string().trim().min(8).max(100).required(),
  });
  return schema.validate(obj);
}
// validate to login in
function validateUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(2).max(100).required(),
    numberKey: joi.string().trim().min(2).max(100).required(),
    password: joi.string().trim().min(8).max(100).required(),
  });
  return schema.validate(obj);
}
// validate Update user 
function validateUpateUser(obj){
  const schema = joi.object({
    username:joi.string().trim().min(2).max(100),
    password:joi.string().trim().min(8).max(100), 
    bio:joi.string(),
  })
  return schema.validate(obj);
}
module.exports = {
  User,
  validateRwgisterUser,
  validateUser,
  validateUpateUser
};
