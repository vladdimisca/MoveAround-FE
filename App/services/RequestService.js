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

const acceptRequest = async (requestId, token) => {
  return axios
    .post(
      `${config.API_URL}/requests/${requestId}/accept`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => response.data);
};

const rejectRequest = async (requestId, token) => {
  return axios
    .post(
      `${config.API_URL}/requests/${requestId}/reject`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => response.data);
};

const deleteRequest = async (requestId, token) => {
  return axios
    .delete(`${config.API_URL}/requests/${requestId}`, {
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
  acceptRequest,
  rejectRequest,
  deleteRequest,
};
