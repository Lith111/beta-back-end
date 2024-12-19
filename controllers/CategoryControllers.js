const expressAsyncHandler = require("express-async-handler");
const {Category, vaildateCreateCategory} = require("../models/Category");
/**-----------------------------------------------
 * @desc     Create New Category
 * @route   /api/category
 * @method  post
 * @access  private (only admin )
-------------------------------------------*/
module.exports.createCategoryContrl = expressAsyncHandler(async(req,res)=>{
  const {error} = vaildateCreateCategory(req.body);  
    if (error) {
        return res.status(400).json({message:error.details[0].message});
    }
    const category = await Category.create({
        title:req.body.title,
        user:req.user.id,
    })
    res.status(201).json(category);
})
/**-----------------------------------------------
 * @desc     get all Category
 * @route   /api/category
 * @method  GET
 * @access  private (only admin )
-------------------------------------------*/
module.exports.getAllCategoryContrl = expressAsyncHandler(async(req,res)=>{
      const category = await Category.find()
      res.status(200).json(category);
  })
  /**-----------------------------------------------
 * @desc     deleat single Category
 * @route   /api/category/:id
 * @method  deleat
 * @access  private (only admin )
-------------------------------------------*/
module.exports.deleteCategory = expressAsyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({message:"not found"});
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(400).json({message:"the Delete is secssfully",
                          CategoryId: category._id });
})