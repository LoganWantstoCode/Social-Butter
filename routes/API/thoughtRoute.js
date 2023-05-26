const router = require("express").Router();
const {
  getThought,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController.js");

// /api/courses
router.route("/").get(getThought).post(createThought);

// /api/courses/:courseId
router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

router.route("/:thoughtId/reactions").post(addReaction);

module.exports = router;
