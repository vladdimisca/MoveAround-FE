import axiosInstance from "../util/AxiosUtil";

// config
import config from "../../config";

const getUserById = async (userId) => {
  return axiosInstance
    .get(`${config.API_URL}/users/${userId}`)
    .then((response) => response.data);
};

const register = async (data) => {
  return axiosInstance
    .post(`${config.API_URL}/users/register`, data)
    .then((response) => response.data);
};

const login = async (phoneNumber, callingCode, password) => {
  return axiosInstance
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

const updateUserById = async (userId, user) => {
  return axiosInstance
    .put(`${config.API_URL}/users/${userId}`, user)
    .then((response) => response.data);
};

const updateProfilePictureById = async (userId, base64picture) => {
  return axiosInstance
    .patch(`${config.API_URL}/users/${userId}/profile-picture`, base64picture)
    .then((response) => response.data);
};

const recoverAccount = async (email) => {
  return axiosInstance
    .post(`${config.API_URL}/users/${email}/forgot-password`)
    .then((response) => response.data);
};

const deleteAccount = async (userId, password) => {
  return axiosInstance.delete(`${config.API_URL}/users/${userId}`, {
    headers: {
      Password: password,
    },
  });
};

const changePassword = async (userId, oldPassword, newPassword) => {
  return axiosInstance.patch(`${config.API_URL}/users/${userId}/password`, {
    newPassword,
    oldPassword,
  });
};

const activateEmail = async (userId, emailCode) => {
  return axiosInstance.post(
    `${config.API_URL}/users/${userId}/activation/email`,
    { emailCode }
  );
};

const resendEmailCode = async (userId) => {
  return axiosInstance.post(
    `${config.API_URL}/users/${userId}/activation/email/resend`
  );
};

const activatePhoneNumber = async (userId, smsCode) => {
  return axiosInstance.post(
    `${config.API_URL}/users/${userId}/activation/phone`,
    { smsCode }
  );
};

const resendSmsCode = async (userId) => {
  return axiosInstance.post(
    `${config.API_URL}/users/${userId}/activation/phone/resend`
  );
};

const getAllUsers = async () => {
  return axiosInstance
    .get(`${config.API_URL}/users`)
    .then((response) => response.data);
};

const getJoinStatistics = async () => {
  return axiosInstance
    .get(`${config.API_URL}/users/join-statistics`)
    .then((response) => response.data);
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
  activatePhoneNumber,
  resendSmsCode,
  getAllUsers,
  getJoinStatistics,
};
