const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require('fs');
const {
  clouldinaryUploadImage,
  clouldinaryRemoveImage,
  clouldinaryRemoveAllImage
} = require("../utils/utils");
const { User, validateUpateUser } = require("../models/Users");
const { post } = require("../models/Post");
const { midcal } = require("../models/MidcalLab");
const { Comment } = require("../models/Comment");
/**-----------------------------------------------
 * @desc    Get all users 
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllUsersCtrl = expressAsyncHandler(async (req, res) => {
  const user = await User.find().select("-password").populate("posts");
  res.status(200).json(user);
});
/**-----------------------------------------------
 * @desc    Get User profile
 * @route   /api/users/profile/: id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getonlyUsersCtrl = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
  if (!user) {
    return res.status(404).json({ message: "the user not found" });
  } else {
    res.status(200).json(user);
  }
});
/**-----------------------------------------------
 * @desc    Upate User profile
 * @route   /api/users/profile/: id
 * @method  PUT
 * @access  private (only user)
 ------------------------------------------------*/
module.exports.updateprofileCtral = expressAsyncHandler(async (req, res) => {
  const { error } = validateUpateUser(req.body);
  // تأكد من عدم وجود أي أيرور على مستوى سيرفر
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // تأكد من تعديل الباسورد و تشفير النتيجة
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  // تابع التعديل
  // تابع مسؤول عن تعديل الأسم و كلمة السر و الbio
  const UpdateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");
  return res.status(200).json( UpdateUser );
});
/**-----------------------------------------------
 * @desc     User profile count
 * @route   /api/users/profile/: id
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.countUsers = expressAsyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});
/**-----------------------------------------------
 * @desc    Upate User phot profile
 * @route   /api/users/profile/: id
 * @method  POST
 * @access  private (only user)
 ------------------------------------------------*/
module.exports.updatephotoProfile = expressAsyncHandler(async (req, res) => {
  // console.log(req.file);
  // تأكد من وصول البيانات
  if (!req.file) {
    return res.status(400).json({ message: "not file provided" });
  }
  // حصول  على مسار الصور
  const imagePath = path.join(__dirname, "..", "images", req.file.filename);
  // رفع الصورة على كلاودناري
  const resault = await clouldinaryUploadImage(imagePath);
  // get user from Db
  const user = await User.findById(req.user.id);
  // حذف الصور القديمة
  if (user.profilePhoto.PublicId !== null) {
    await clouldinaryRemoveImage(user.profilePhoto.PublicId);
  }
  // تغير الصور الى صور الجديدة
  user.profilePhoto = {
    url: resault.secure_url,
    PublicId: resault.public_id,
  };
  await user.save();
  // ارسال النتيجة
  res
    .status(200)
    .json({
      message: "the photo the add to profile",
      profilePhoto: { url: resault.secure_url, PublicId: resault.public_id },
    });
  // delate the image from server
  fs.unlink(imagePath,(err)=>{
      if(err)throw err;
      console.log("deleat is seccsflly");
 });
});
/**-----------------------------------------------
 * @desc    Delete User profile
 * @route   /api/users/profile/: id
 * @method  DELETE
 * @access  private (only admin or user himself )
 ------------------------------------------------*/
module.exports.deleteUserProfil = expressAsyncHandler(async(req,res)=>{
  // found user by id 
  const user = await User.findById(req.params.id);
  // error if not found user 
  if (!user) {
    return res.status(404).json({message:"not found user"});
  }
  const posts = await  post.findById({user : user._id});
  const PublicIds = posts?.map((post)=>post.image.PublicId);
  if (PublicIds?.length > 0 ) {
    await clouldinaryRemoveAllImage(PublicIds);
  }
  const mids = await  midcal.find({userFuture : user._id.toString()});
  const midpublicIds = midcal?.map((mid)=>mid.image.PublicId);
  if (midpublicIds?.length > 0 ) {
    await clouldinaryRemoveAllImage(midpublicIds);
  }
  // Detete the photo user 
  if (user.profilePhoto.PublicId !== null) {
    await clouldinaryRemoveImage(user.profilePhoto.PublicId);
  }
  await post.deleteMany({user : user._id});
  await Comment.deleteMany({user:user._id});
  await midcal.deleteMany({userFuture : user._id.toString()})
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({message:"the delete user is seccsfly"})
})