const db = require("../db/connection.js");
const mapProperties = require("../utils/map-properties.js");
const reduceProperties = require("../utils/reduce-properties.js");

const tableName = "reviews";

const criticConfig = {
  preferred_name: ['critic', 'preferred_name'],
  surname: ['critic', 'surname'],
  organization_name: ['critic', 'organization_name'],
};

async function list(movie_id) {
  return db(`${tableName} as rvs`)
    .join('critics', 'critics.critic_id', 'rvs.critic_id')
    .where('rvs.movie_id', movie_id)
    .then(reduceProperties('review_id', criticConfig));
}

async function read(reviewId) {
  return db(`${tableName} as rvs`)
    .join('critics', 'critics.critic_id', 'rvs.critic_id')
    .where('rvs.review_id', reviewId)
    .first()
    .then(mapProperties(criticConfig));
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review)
    .then(() => read(review.review_id))
    .then(mapProperties(criticConfig));
}

async function destroy(reviewId) {
  return db(tableName)
    .where('review_id', reviewId)
    .del();
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
