const expressAsyncHandler = require("express-async-handler");
const {vaildateCreateComment,vaildateUpdateComment,Comment} = require('../models/Comment')
const {User}  = require('../models/Users')
/**-----------------------------------------------
 * @desc    crete new comment
 * @route   /api/Comment
 * @method  POST
 * @access  private ( loggeer)
 ------------------------------------------------*/
 module.exports.createCommentCtrol = expressAsyncHandler(async(req,res)=>{
//    validate from user
    const {error} = vaildateCreateComment(req.body);
    if (error) {
        return res.status(400).json({message:error.details[0].message});
    }
    const profile = await User.findById(req.user.id);
    const comment = await Comment.create({
        postId:req.body.postId,
        text:req.body.text,
        user:req.user.id,
        username:profile.username,
    });
    res.status(201).json(comment);
 }) 
 /**-----------------------------------------------
 * @desc    get all comment 
 * @route   /api/Comment
 * @method  Get
 * @access  private (only admin)
 -------------------------------------------*/
 module.exports.getAllCommentCtrol = expressAsyncHandler(async(req,res)=>{
const comment = await Comment.find().populate("user");
        res.status(200).json(comment);
     }) 
/**-----------------------------------------------
 * @desc    Delate  comment 
 * @route   /api/Comment/:id
 * @method  DELLATE
 * @access  private (only admin and write this comment )
 -------------------------------------------*/
 module.exports.DellateCommentCtrol = expressAsyncHandler(async(req,res)=>{
    const comment = await  Comment.findById(req.params.id);
    if (!comment) {
        return res.status(404).json({message:"not found "});
    }
    if (!req.user.isAdmin || req.user.id !==  comment.user.toString() ) {
        return res.status(401).json({message:"not allownd dellat"});
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"dellate is secssflly"})
    
});
/**-----------------------------------------------
 * @desc     update comment 
 * @route   /api/Comment/:id
 * @method  update
 * @access  private (only write this comment )
 -------------------------------------------*/
 module.exports.updateCommentCtrol = expressAsyncHandler(async(req,res)=>{
    const {error} = vaildateUpdateComment(req.body);
    if (error) {
        return res.status(400).json({message:error.details[0].message});
    }
    const comment = await  Comment.findById(req.params.id);
    if (!comment) {
        return res.status(404).json({message:"not found "});
    }
    if ( req.user.id !==  comment.user.toString() ) {
        return res.status(403).json({message:"not allownd dellat"});
    }
    const update = await Comment.findByIdAndUpdate(req.params.id,{
        $set:{
            text : req.body.text
        }
    },{new: true}) ;

   res.status(200).json(update) 
});   