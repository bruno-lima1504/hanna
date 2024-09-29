import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/src/services/api";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
};

type UserProps = {
  user: string;
  ambiente: string;
  name: string;
  email: string;
  userId: string;
  userIdGroup: string;
  sellerId: string;
};

const defaultUser: UserProps = {
  user: "",
  ambiente: "",
  name: "",
  email: "",
  userId: "",
  userIdGroup: "",
  sellerId: "",
};

const defaultAuthContext: AuthContextData = {
  user: defaultUser,
  isAuthenticated: true,
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(defaultAuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>(defaultUser);

  const isAuthenticated = !!user.name;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
