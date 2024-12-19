const photoUpdate = require("../middlewares/photoUpdata");
const { verifyToken, verifyTokenandAdmin, verifyTokenandonlyUser } = require("../middlewares/viriflyToken");
const {createmidcalctrl, getAllMidcalCtral, deletMidcalCtrl, getMidcalCtral} = require("../controllers/midcalControllers");
const validateObjectId = require("../middlewares/validateObjectId");
const router = require("express").Router();
router
  .route("/")
  .post(
    verifyToken,
    verifyTokenandAdmin,
    photoUpdate.single("image"),
    createmidcalctrl
 )
 .get(
  verifyToken,
  getAllMidcalCtral
 )
router.route('/:id')
.get(
    validateObjectId,
    verifyTokenandonlyUser,
    getMidcalCtral
)
.delete(
  verifyToken,
  verifyTokenandAdmin,
  deletMidcalCtrl

 )
module.exports = router