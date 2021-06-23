import axiosInstance from "../util/AxiosUtil";

// config
import config from "../../config";

const createCar = async (data) => {
  return axiosInstance
    .post(`${config.API_URL}/cars`, data)
    .then((response) => response.data);
};

const updateCarById = async (carId, data) => {
  return axiosInstance
    .put(`${config.API_URL}/cars/${carId}`, data)
    .then((response) => response.data);
};

const getCarById = async (carId) => {
  return axiosInstance
    .get(`${config.API_URL}/cars/${carId}`)
    .then((response) => response.data);
};

const getAllCarsByUserId = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/cars/user/${userId}`)
    .then((response) => response.data);
};

const deleteCarById = async (carId) => {
  return axiosInstance.delete(`${config.API_URL}/cars/${carId}`);
};

export const CarService = {
  createCar,
  updateCarById,
  getCarById,
  getAllCarsByUserId,
  deleteCarById,
};
