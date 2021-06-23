import axiosInstance from "../util/AxiosUtil";

// config
import config from "../../config";

const createRoute = async (data) => {
  return axiosInstance
    .post(`${config.API_URL}/routes`, data)
    .then((response) => response.data);
};

const getRouteById = async (routeId) => {
  return axiosInstance
    .get(`${config.API_URL}/routes/${routeId}`)
    .then((response) => response.data);
};

const deleteRouteById = async (routeId) => {
  return axiosInstance
    .delete(`${config.API_URL}/routes/${routeId}`)
    .then((response) => response.data);
};

const getRoutesAsDriver = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/routes/user/${userId}/driver`)
    .then((response) => response.data);
};

const getRoutesAsPassenger = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/routes/user/${userId}/passenger`)
    .then((response) => response.data);
};

const getWaypoints = async (routeId) => {
  return axiosInstance
    .get(`${config.API_URL}/routes/${routeId}/waypoints`)
    .then((response) => response.data);
};

const getPossibleRoutes = async (startDate) => {
  return axiosInstance
    .get(`${config.API_URL}/routes/matching/${startDate}`)
    .then((response) => response.data);
};

const getNumberOfRoutes = async () => {
  return axiosInstance
    .get(`${config.API_URL}/routes`)
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
  getNumberOfRoutes,
};
