import React, { createContext, useState } from "react";

// storage
import { AuthenticationStorage } from "../storage/AuthenticationStorage";

// services
import { UserService } from "../../services/UserService";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    const { token, userId } = await AuthenticationStorage.retrieveUser();
    await UserService.getUserById(userId, token)
      .then((user) => setCurrentUser(user))
      .catch(() => null);
  };

  const contextValue = {
    currentUser,
    setCurrentUser,
    fetchUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
