import axios from "axios";

// config
import config from "../../config";

const createReview = async (data, token) => {
  return axios
    .post(`${config.API_URL}/reviews`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getReviewById = async (reviewId, token) => {
  return axios
    .get(`${config.API_URL}/reviews/${reviewId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getReviewsByUserId = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/reviews/receiver/${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getAvgRatingByUserId = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/reviews/rating/${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const updateReviewById = async (reviewId, updatedReview, token) => {
  return axios
    .put(`${config.API_URL}/reviews/${reviewId}`, updatedReview, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const deleteReviewById = async (reviewId, token) => {
  return axios
    .delete(`${config.API_URL}/reviews/${reviewId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

export const ReviewService = {
  createReview,
  getReviewById,
  updateReviewById,
  getAvgRatingByUserId,
  getReviewsByUserId,
  deleteReviewById,
};
