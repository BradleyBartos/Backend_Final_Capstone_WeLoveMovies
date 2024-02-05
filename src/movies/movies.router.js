const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// sub routes
router.use('/:movieId/theaters', theatersRouter);
router.use('/:movieId/reviews', reviewsRouter);

// routes
router.route('/')
  .get(controller.list)
  .all(methodNotAllowed);
router.route('/:movieId')
  .get(controller.read)
  .all(methodNotAllowed);

module.exports = router;
