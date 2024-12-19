const { createCategoryContrl, getAllCategoryContrl, deleteCategory } = require("../controllers/CategoryControllers");
const { verifyTokenandAdmin } = require("../middlewares/viriflyToken");
const validateObjectId = require("../middlewares/validateObjectId")
const router = require("express").Router();
router.route("/")
    .post(verifyTokenandAdmin,createCategoryContrl)
    .get(getAllCategoryContrl)

router.route("/:id")
    .delete(validateObjectId , verifyTokenandAdmin,deleteCategory)
module.exports = router;