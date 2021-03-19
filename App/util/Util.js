import { UserService } from "../services/UserService";
import { UserStorage } from "./storage/UserStorage";

const getCurrentUser = async () => {
  const { token, userId } = await UserStorage.retrieveUserIdAndToken();
  return UserService.getUserById(userId, token).catch(() => null);
};

export const Util = {
  getCurrentUser,
};
