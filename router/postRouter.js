const router = require("express").Router();
const {
  createPostctrl,
  getAllPostCtral,
  UpdatePostCtrl,
  getSingelPostCtrl,
  getcountPostCtrl,
  deletPostCtrl,
  UpdateimagePostCtrl,
  toggleLikeCtrl,
} = require("../controllers/PostControllers");
const photoUpdate = require("../middlewares/photoUpdata");
const {
  verifyToken,
  verifyTokenandAdminorolyDoctor,
  verifyTokenandAdminorolyuser,
} = require("../middlewares/viriflyToken");
const vaidateObjectId = require("../middlewares/validateObjectId");
router
  .route("/")
  .post(
    verifyToken,
    verifyTokenandAdminorolyDoctor,
    photoUpdate.single("image"),
    createPostctrl
 )
  .get(getAllPostCtral);

router.route("/count").get(getcountPostCtrl);
router
  .route("/:id")
  .get(vaidateObjectId, getSingelPostCtrl)
  .put(vaidateObjectId, verifyToken, verifyTokenandAdminorolyDoctor, UpdatePostCtrl)
  .delete(vaidateObjectId,verifyToken,deletPostCtrl)
  router
  .route("/update-image-post/:id")
  .put(vaidateObjectId,verifyToken,photoUpdate.single("image"),UpdateimagePostCtrl);

  router
  .route("/like/:id")
    .put(vaidateObjectId,verifyToken,toggleLikeCtrl);
module.exports = router;
