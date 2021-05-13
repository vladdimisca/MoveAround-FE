import axios from "axios";

// config
import config from "../../config";

const createRequest = async (data, token) => {
  return axios
    .post(`${config.API_URL}/requests`, data, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getReceivedRequests = async (token) => {
  return axios
    .get(`${config.API_URL}/requests/received`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const getSentRequests = async (token) => {
  return axios
    .get(`${config.API_URL}/requests/sent`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

export const RequestService = {
  createRequest,
  getReceivedRequests,
  getSentRequests,
};
