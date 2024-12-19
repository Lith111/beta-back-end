const { getAllUsersCtrl, getonlyUsersCtrl, updateprofileCtral, countUsers, updatephotoProfile, deleteUserProfil } = require('../controllers/usersControllers');
const { verifyTokenandAdmin, verifyTokenandonlyUser , verifyToken, verifyTokenandAdminorolyuser} = require('../middlewares/viriflyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const photoUpdate = require('../middlewares/photoUpdata');
const router = require('express').Router();
router.route('/profile').get(verifyTokenandAdmin,getAllUsersCtrl);
// users only
router.route('/profile/:id')
    .get(validateObjectId,getonlyUsersCtrl)
    .put(validateObjectId,verifyTokenandonlyUser,updateprofileCtral)
    .delete(validateObjectId,verifyTokenandAdminorolyuser,deleteUserProfil)
    // counter of the Users 
router.route('/count').get(verifyTokenandAdmin,countUsers); 
router.route("/profile/photo-profile").post(verifyToken,photoUpdate.single("image"),updatephotoProfile)
module.exports = router;
