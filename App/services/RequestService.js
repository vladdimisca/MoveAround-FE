import axiosInstance from "../util/AxiosUtil";

// config
import config from "../../config";

const createRequest = async (data) => {
  return axiosInstance
    .post(`${config.API_URL}/requests`, data)
    .then((response) => response.data);
};

const getReceivedRequests = async () => {
  return axiosInstance
    .get(`${config.API_URL}/requests/received`)
    .then((response) => response.data);
};

const getSentRequests = async () => {
  return axiosInstance
    .get(`${config.API_URL}/requests/sent`)
    .then((response) => response.data);
};

const acceptRequest = async (requestId) => {
  return axiosInstance
    .post(`${config.API_URL}/requests/${requestId}/accept`)
    .then((response) => response.data);
};

const rejectRequest = async (requestId) => {
  return axiosInstance
    .post(`${config.API_URL}/requests/${requestId}/reject`)
    .then((response) => response.data);
};

const deleteRequest = async (requestId) => {
  return axiosInstance
    .delete(`${config.API_URL}/requests/${requestId}`)
    .then((response) => response.data);
};

export const RequestService = {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  deleteRequest,
};
