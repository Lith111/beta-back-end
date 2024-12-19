const router = require("express").Router();
const {registerUserCtrl, loginUserCtrl} = require("../controllers/authControllers");
router.post('/register',registerUserCtrl);
//  /api/auth/login
router.post('/login',loginUserCtrl)
module.exports = router