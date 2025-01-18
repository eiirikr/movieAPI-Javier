const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.js");
const { verify, isLoggedIn } = require("../auth");

router.post("/addMovie", verify, isLoggedIn, movieController.addMovie);
router.get("/getMovies", verify, isLoggedIn, movieController.getAllMovies);
router.get("/getMovie/:id", verify, isLoggedIn, movieController.getMovieById);
router.patch(
  "/updateMovie/:id",
  verify,
  isLoggedIn,
  movieController.updateMovie
);
router.delete(
  "/deleteMovie/:id",
  verify,
  isLoggedIn,
  movieController.deleteMovie
);
router.patch("/addComment/:id", verify, isLoggedIn, movieController.addComment);
router.get("/getComments/:id", verify, isLoggedIn, movieController.getComments);

module.exports = router;
