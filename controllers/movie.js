const Movie = require("../models/Movie");
const { errorHandler } = require("../auth.js");
const jwt = require("jsonwebtoken");

module.exports.addMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Access denied." });

    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies: movies });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.status(200).json(movie);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.updateMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Access denied." });

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res
      .status(200)
      .json({ message: "Movie updated successfully", updatedMovie: movie });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.deleteMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Access denied." });

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    movie.comments.push({
      userId: req.user.id,
      comment: req.body.comment,
      _id: req.params.id,
    });
    await movie.save();
    res
      .status(200)
      .json({ message: "comment added successfully", updatedMovie: movie });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate(
      "comments.userId",
      "email"
    ); // Populate userId with email field from User model

    if (!movie) return res.status(404).json({ message: "Movie not found." });

    // Map over the comments and restructure them to have userId first
    const commentsWithUserDetails = movie.comments.map((comment) => ({
      userId: req.user.id,
      comment: comment.comment, // Keep the comment text
      _id: comment._id, // Keep the comment ID
    }));

    res.status(200).json({ comments: commentsWithUserDetails });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
