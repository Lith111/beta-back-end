const fs = require("fs");
const path = require("path");
const expressAsyncHandler = require("express-async-handler");
const {midcal,vaidateCreatMidcal} =require("../models/MidcalLab.js");
const { clouldinaryUploadImage, clouldinaryRemoveImage } = require("../utils/utils.js");
/**-----------------------------------------------
 * @desc    crete new midcl
 * @route   /api/midcal
 * @method  POST
 * @access  private (only admin )
 ------------------------------------------------*/
 module.exports.createmidcalctrl = expressAsyncHandler(async (req, res) => {
    // validateion for image
    if (!req.file) {
      return res.status(400).json({ message: "not add image to post" });
    }
    // validte for date
    const { error } = vaidateCreatMidcal(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `not add body of post${error.details[0].message}` });
    }
    const imagepath = path.join(__dirname, "..", "images", req.file.filename);
    const result = await clouldinaryUploadImage(imagepath);
    const postnew = await midcal.create({
      title: req.body.title,
      userFuture: req.body.userFuture,
      description: req.body.description,
      user: req.user.id,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
    res.status(200).json({ message: "post add is secssfly" });
    fs.unlink(imagepath, (err) => {
      if (err) throw err;
      console.log("deleat is seccsflly");
    });
});
/**-----------------------------------------------
 * @desc    get post
 * @route   /api/post/:id
 * @method  GET
 * @access  private (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.getMidcalCtral = expressAsyncHandler(async (req, res) => {
  if (req.user.id !== req.query.userFuture) {
     console.log(req.query.userFuture);
     console.log(req.user.id);
    return res.status(400).json({message:"error"});
  }
  const midaclNew = await midcal
    .find({userFuture:req.user.id.toString()})
    .sort({ createdAt: -1 })
    if (!midaclNew) {
      return res.status(404).json({message:"not found mid"});
    }
    res.status(200).json(midaclNew);
   });
  /**-----------------------------------------------
   * /**-----------------------------------------------
 * @desc    get All midcal
 * @route   /api/post/:id
 * @method  GET
 * @access  private (only  admin )
 ------------------------------------------------*/
 module.exports.getAllMidcalCtral = expressAsyncHandler(async (req, res) => {
  const midaclNew = await midcal
    .find()
    .sort({ createdAt: -1 })
    if (!midaclNew) {
      return res.status(404).json({message:"not found post"});
    }
    if (!req.user.isAdmin) {
      return res.status(400).json({message:"not allownd this users , not admin"});
    }
    res.status(200).json(midaclNew);
   });
  /**-----------------------------------------------
 * @desc     Midcal posts
 * @route   /api/midacl
 * @method  Deleat
 * @access Private  (only admin )
 ------------------------------------------------*/
 module.exports.deletMidcalCtrl = expressAsyncHandler(async (req, res) => {
  const midaclNew = await midcal.findById(req.params.id);
  // 1. تاكد من وجود البوست 
  if (!midaclNew) {
    return res.status(404).json({message:"not found post"});
  }
  // 2.حئف صوورة البوست من clouyd
  if (midaclNew.image.publicId !== null) {
   await  clouldinaryRemoveImage(midaclNew.image.publicId);
  }
  // حذف كل البوست 
  if (req.user.isAdmin) {
    await midcal.findByIdAndDelete(req.params.id);
      //ارسال النتيجة
    res.status(200).json({message:"delet is sccess "});
  }else{
    res.status(403).json({message:"access denied , forbidden"});
  }
 });