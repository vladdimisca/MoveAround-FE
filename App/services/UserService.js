import axios from "axios";

// config
import config from "../../config";

const getUserById = async (userId, token) => {
  return axios
    .get(`${config.API_URL}/users/${userId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const register = async (data) => {
  return axios
    .post(`${config.API_URL}/users/register`, data)
    .then((response) => response.data);
};

const login = async (phoneNumber, callingCode, password) => {
  return axios
    .post(`${config.API_URL}/users/login`, {
      phoneNumber,
      callingCode,
      password,
    })
    .then((response) => {
      return {
        token: response.headers.authorization,
        user: response.data,
      };
    });
};

const updateUserById = async (userId, token, user) => {
  return axios
    .put(`${config.API_URL}/users/${userId}`, user, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => response.data);
};

const updateProfilePictureById = async (userId, token, base64picture) => {
  return axios
    .patch(`${config.API_URL}/users/${userId}/profile-picture`, base64picture, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
};

const recoverAccount = async (email) => {
  return axios
    .post(`${config.API_URL}/users/${email}/forgot-password`)
    .then((response) => response.data);
};

const deleteAccount = async (userId, token) => {
  return axios.delete(`${config.API_URL}/users/${userId}`, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });
};

const changePassword = async (userId, token, oldPassword, newPassword) => {
  return axios.patch(
    `${config.API_URL}users/${userId}/password`,
    {
      newPassword,
      oldPassword,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const activateEmail = async (userId, token, emailCode) => {
  return axios.post(
    `${config.API_URL}users/${userId}/activation/email`,
    { emailCode },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const resendEmailCode = async (userId, token) => {
  return axios.post(
    `${config.API_URL}users/${userId}/activation/email/resend`,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const UserService = {
  register,
  login,
  getUserById,
  updateUserById,
  updateProfilePictureById,
  recoverAccount,
  deleteAccount,
  changePassword,
  activateEmail,
  resendEmailCode,
};
