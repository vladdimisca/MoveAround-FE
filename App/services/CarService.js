import axios from "axios";

// config
import config from "../../config";

const createCar = async (data, token) => {
  return axios
    .post(`${config.API_URL}/cars`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const updateCarById = async (carId, data, token) => {
  return axios
    .put(`${config.API_URL}/cars/${carId}`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getCarById = async (carId, token) => {
  return axios
    .get(`${config.API_URL}/cars/${carId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getAllCarsByUserId = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/cars/user/${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const deleteCarById = async (carId, token) => {
  return axios.delete(`${config.API_URL}/cars/${carId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const CarService = {
  createCar,
  updateCarById,
  getCarById,
  getAllCarsByUserId,
  deleteCarById,
};
