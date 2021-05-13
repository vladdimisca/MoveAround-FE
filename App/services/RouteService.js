import axios from "axios";

// config
import config from "../../config";

const createRoute = async (data, token) => {
  return axios
    .post(`${config.API_URL}/routes`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getRouteById = async (routeId, token) => {
  return axios
    .get(`${config.API_URL}/routes/${routeId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getAllRoutesByUserId = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/routes/user/${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getPossibleRoutes = async (data, token) => {
  return axios
    .post(`${config.API_URL}/routes/matching`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

export const RouteService = {
  createRoute,
  getRouteById,
  getAllRoutesByUserId,
  getPossibleRoutes,
};
