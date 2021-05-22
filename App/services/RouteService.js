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

const deleteRouteById = async (routeId, token) => {
  return axios
    .delete(`${config.API_URL}/routes/${routeId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getRoutesAsDriver = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/routes/user/${userId}/driver`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getRoutesAsPassenger = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/routes/user/${userId}/passenger`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getWaypoints = async (routeId, token) => {
  return axios
    .get(`${config.API_URL}/routes/${routeId}/waypoints`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getPossibleRoutes = async (startDate, token) => {
  return axios
    .get(`${config.API_URL}/routes/matching/${startDate}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

export const RouteService = {
  createRoute,
  getRouteById,
  deleteRouteById,
  getRoutesAsDriver,
  getRoutesAsPassenger,
  getWaypoints,
  getPossibleRoutes,
};
