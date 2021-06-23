import axiosInstance from "../util/AxiosUtil";

// config
import config from "../../config";

const createReview = async (data) => {
  return axiosInstance
    .post(`${config.API_URL}/reviews`, data)
    .then((response) => response.data);
};

const getReviewById = async (reviewId) => {
  return axiosInstance
    .get(`${config.API_URL}/reviews/${reviewId}`)
    .then((response) => response.data);
};

const getReviewsByUserId = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/reviews/receiver/${userId}`)
    .then((response) => response.data);
};

const getAvgRatingByUserId = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/reviews/rating/${userId}`)
    .then((response) => response.data);
};

const updateReviewById = async (reviewId, updatedReview) => {
  return axiosInstance
    .put(`${config.API_URL}/reviews/${reviewId}`, updatedReview)
    .then((response) => response.data);
};

const deleteReviewById = async (reviewId) => {
  return axiosInstance
    .delete(`${config.API_URL}/reviews/${reviewId}`)
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
