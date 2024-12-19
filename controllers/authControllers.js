const expressAsyncHandler = require("express-async-handler");
const { User, validateRwgisterUser, validateUser } = require("../models/Users");
const bcrypt  = require("bcryptjs")
/*
---------------------------------------------
* @desc      Register New User               |
-@router    /api/auth/register              |
-@method    POST
-@access    public
--------------------------------------------
*/
module.exports.registerUserCtrl = expressAsyncHandler(async (req, res) => {
  // validation
  const { error } = validateRwgisterUser(req.body);
  // ظهور ايرور في عمليات
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({  numberKey: req.body.numberKey });
  if (user) {
    return res.status(400).json({ message: "user already exist" });}
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = new User({
    username: req.body.username,
    email: req.body.email,
    numberKey: req.body.numberKey,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).json({ message: "register is secessflly " });
});
/**-----------------------------------------------
 * @desc    Login User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
 module.exports.loginUserCtrl = expressAsyncHandler(async(req,res)=>{
    // -1 validtion
    const { error } = validateUser(req.body);
    // ظهور ايرور في عمليات
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }    
    // -2 is user exist
    const user = await User.findOne({numberKey: req.body.numberKey});
    if(!user){
      return res.status(400).json({message:"invalid email or password"});
    }
      // -3 check the password
    const ispassword = await bcrypt.compare(req.body.password,user.password);
    if(!ispassword){
      return res.status(400).json({message:"invalid email or password"});
    }
    // jwt
    const token = user.generateAuthtoken();
    res.status(200).json({
      _id: user.id,
      isAdmin: user.isAdmin,
      isDoctor: user.isDoctor,
      profilePhoto: user.profilePhoto,
      token,
      username : user.username,
    })
    // -5 response t0 client
 });
