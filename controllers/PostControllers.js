const fs = require("fs");
const path = require("path");
const {Comment} = require("../models/Comment")
const expressAsyncHandler = require("express-async-handler");
const { vaidateCreatPost, vaidateUpdatePost, post } = require("../models/Post");
const { clouldinaryUploadImage, clouldinaryRemoveImage } = require("../utils/utils");
/**-----------------------------------------------
 * @desc    crete new post
 * @route   /api/post
 * @method  POST
 * @access  private (only Doctor or admin )
 ------------------------------------------------*/
module.exports.createPostctrl = expressAsyncHandler(async (req, res) => {
  // validateion for image
  if (!req.file) {
    return res.status(400).json({ message: "not add image to post" });
  }
  // validte for date
  const { error } = vaidateCreatPost(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: `not add body of post${error.details[0].message}` });
  }
  const imagepath = path.join(__dirname, "..", "images", req.file.filename);
  const result = await clouldinaryUploadImage(imagepath);
  const postnew = await post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
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
 * @desc    get All posts
 * @route   /api/posts
 * @method  GET
 * @access  all
 ------------------------------------------------*/
module.exports.getAllPostCtral = expressAsyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  // تحديد الأظهار عن طريق عدد معين من عناصر
  if (pageNumber) {
    posts = await post
      .find()
      .sort({ createdAt: -1 })
      .skip(pageNumber - 1)
      .limit(category)
      .populate("user",['-password']);
      // تحديد البحث عن طريق صنف
  } else if (category) {
    posts = await post.find({ category }).sort({ createdAt: -1 })
    .populate("user",['-password']);
  } else {
    posts = await post.find().sort({ createdAt: -1 })
    .populate("user",['-password']);
  }
  res.status(200).json(posts);
});
/**-----------------------------------------------
 * @desc     get singel post by id 
 * @route   /api/post:id
 * @method  GET
 * @access public  (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.getSingelPostCtrl = expressAsyncHandler(async (req, res) => {
  const postNew = await post.findById(req.params.id).populate("user",["-password"]).populate("comments");
  if (!postNew) {
    return res.status(404).json({message:"not found post"});
  }
  res.status(200).json(postNew);
 });
 /**-----------------------------------------------
 * @desc    get count posts
 * @route   /api/post/count
 * @method  GEt
 * @access Ppublic  (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.getcountPostCtrl = expressAsyncHandler(async (req, res) => {
  const count = await post.count();
  res.status(200).json({count})

 });
/**-----------------------------------------------
 * @desc    Update  posts
 * @route   /api/post
 * @method  PUT
 * @access Private  (only Doctor or admin )
 ------------------------------------------------*/
module.exports.UpdatePostCtrl = expressAsyncHandler(async (req, res) => {
  // 1. validtion to req
  const { error } = vaidateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ messsage: error.details[0].message });
  }
  // 2. Get the post from DB and check if post exist
  const postnew = await post.findById(req.params.id);
  if (!postnew) {
    return res.status(404).json({ message: "not found post" });
  }
  // check if the user write this post
  if (req.user.id !== postnew.user.toString()) {
    return res.status(403).json({message:"access denied , you are not allowed"});
  }
  // upate for post  
  const updatePost = await post.findByIdAndUpdate(req.params.id , {
    $set:{
      title: req.body.title,
      description: req.body.description,
      category : req.body.category,
    }},
    {new: true}).populate("user", ["-password"]); 
    // send response to the client  
    res.status(200).json(updatePost);
});
/**-----------------------------------------------
 * @desc     Upadte image posts
 * @route   /api/post
 * @method  PUT
 * @access Private  (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.UpdateimagePostCtrl = expressAsyncHandler(async (req, res) => {
// 1.Validtion 
if (!req.file) {
  return res.status(400).json({message:"no image provided"});
} 
// 2.get post for db
const postNew = await post.findById(req.params.id);
if (!postNew) {
  return res.status(404).json({message:"not found the post"});
}
// chech 
if (!req.user.isAdmin) {
  return res.status(403).json({message:"not allownd"});
}
// delate old image 
await clouldinaryRemoveImage(postNew.image.publicId);
// update to image
const imagepath = path.join(__dirname,"..","images",req.file.filename);
const result = await clouldinaryUploadImage(imagepath);
// upate the image field in the db 
const updatePost = await post.findByIdAndUpdate(
  req.params.id,{
    $set:{
      image :{
        url: result.secure_url,
        publicId: result.public_id,
      },
     }
    }
 ,{new:true} );
//  send 
res.status(200).json(updatePost);
fs.unlink(imagepath,(err)=>{
  if(err)throw err;
  console.log("deleat is seccsflly");
});});
/**-----------------------------------------------
 * @desc     Deleat posts
 * @route   /api/post
 * @method  PUT
 * @access Private  (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.deletPostCtrl = expressAsyncHandler(async (req, res) => {
  const postNew = await post.findById(req.params.id);
  // 1. تاكد من وجود البوست 
  if (!postNew) {
    return res.status(404).json({message:"not found post"});
  }
  // 2.حئف صوورة البوست من clouyd
  if (postNew.image.publicId !== null) {
   await  clouldinaryRemoveImage(postNew.image.publicId);
  }
  // حذف كل البوست 
  if (req.user.isAdmin || req.user.id === postNew.user.toString()) {
    await Comment.deleteMany({postId : postNew._id});
    await post.findByIdAndDelete(req.params.id);
      //ارسال النتيجة
    res.status(200).json({message:"delet is sccess ",postId : postNew._id});
  }else{
    res.status(403).json({message:"access denied , forbidden"});
  }
 });
/**-----------------------------------------------
 * //
 * @desc     togle like
 * @route   /api/posts.like/:id
 * @method  PUT
 * @access Private  (only Doctor or admin )
 ------------------------------------------------*/
 module.exports.toggleLikeCtrl = expressAsyncHandler(async (req,res)=>{
  const loggedInUser = req.user.id;
  const {id: postId} = req.params;
   let postnew = await  post.findById(postId);
   if (!postnew) {
    return res.status(404).json({message:"post not  found "});
   }
   const isPostAlreadyLiked = postnew.likes.find((user)=>user.toString()=== loggedInUser)
   if (isPostAlreadyLiked) {
    postnew = await post.findByIdAndUpdate(postId,
      {
        $pull:{likes: loggedInUser}
      },
      {new:true})
   }else{
    postnew = await post.findByIdAndUpdate(postId,
      {
        $push:{likes: loggedInUser}
      },
      {new:true})
   }
  res.status(200).json(postnew);
 })