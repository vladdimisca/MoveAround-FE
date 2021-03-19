import AsyncStorage from "@react-native-community/async-storage";

const TOKEN = "TOKEN";
const USER_ID = "USER_ID";

const saveUserIdAndToken = async (token, userId) => {
  await AsyncStorage.setItem(TOKEN, token);
  await AsyncStorage.setItem(USER_ID, userId);
};

const retrieveUserIdAndToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN);
  const userId = await AsyncStorage.getItem(USER_ID);
  return {
    token,
    userId,
  };
};

const clearStorage = async () => {
  await AsyncStorage.removeItem(TOKEN);
  await AsyncStorage.removeItem(USER_ID);
};

export const UserStorage = {
  saveUserIdAndToken,
  retrieveUserIdAndToken,
  clearStorage,
};
