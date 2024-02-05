const service = require("./reviews.service");
const { movieExists } = require("../movies/movies.controller");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  if (review) {
    return next();
  }

  next({ status: 404, message: 'Review cannot be found.'});
}

// handlers
async function list(request, response) {
  const data = await service.list(request.params.movieId);
  response.status(200).json({ data });
}

async function update(request, response) {
  const requestData = request.body.data;
  requestData.review_id = request.params.reviewId;

  const data = await service.update(requestData)
  response.status(200).json({ data });
}

async function destroy(request, response) {
  await service.destroy(request.params.reviewId);
  response.sendStatus(204);
}

module.exports = {
  list: [
    hasMovieIdInPath,
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(list),
  ],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
};
