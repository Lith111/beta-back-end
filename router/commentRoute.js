const router = require("express").Router();
const {createCommentCtrol, getAllCommentCtrol, DellateCommentCtrol, updateCommentCtrol} = require("../controllers/commentControllers");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken, verifyTokenandAdmin } = require("../middlewares/viriflyToken");

// /api/comment
router.route("/")
.post(verifyToken,createCommentCtrol)
.get(verifyTokenandAdmin,getAllCommentCtrol);
router.route("/:id")
.delete(validateObjectId,verifyToken,DellateCommentCtrol)
.put(validateObjectId,verifyToken,updateCommentCtrol);
module.exports = router;