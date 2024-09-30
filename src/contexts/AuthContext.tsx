import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/src/services/api";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  loading: boolean;
  loadingAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  credentialsMsg: boolean;
  signOut: () => Promise<void>;
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

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  usuario: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    user: "",
    ambiente: "",
    name: "",
    email: "",
    userId: "",
    userIdGroup: "",
    sellerId: "",
  });

  const isAuthenticated = !!user.name;

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentialsMsg, setCredentialsMsg] = useState(false);

  useEffect(() => {
    async function getUser() {
      //pegar os dados salvos do user
      const userInfo = await AsyncStorage.getItem("@hanna");
      let hasUser: UserProps = JSON.parse(userInfo || "{}");
      console.log(hasUser);
      if (Object.keys(hasUser).length > 0) {
        // api.defaults.headers.common['Authorization']= `Bearer ${hasUser.token}`
        setUser({
          user: hasUser.user,
          ambiente: hasUser.ambiente,
          name: hasUser.name,
          email: hasUser.email,
          userId: hasUser.userId,
          userIdGroup: hasUser.userIdGroup,
          sellerId: hasUser.sellerId,
        });
      }
      setLoading(false);
    }
    getUser();
  }, []);

  async function signIn({ usuario, password }: SignInProps) {
    setLoadingAuth(true);
    console.log(usuario);
    console.log(password);
    try {
      const response = await api.post("/authentication", {
        usuario: usuario,
        senha: password,
      });

      const { userId, user, ambiente, name, email, sellerId, userIdGroup } =
        response.data;

      if (!response.data) {
        setCredentialsMsg(true);
        setLoadingAuth(false);
        return;
      }

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@hanna", JSON.stringify(data));

      // com isso agora passamos o nosso token para verificação em todas as chamadas da api
      // api.defaults.headers.common["Authorization"] = `Bearer  ${token}`;

      setUser({
        userId,
        ambiente,
        user,
        name,
        email,
        sellerId,
        userIdGroup,
      });

      setLoadingAuth(false);
    } catch (err) {
      console.log("erro ao acessar -> " + err);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        user: "",
        ambiente: "",
        name: "",
        email: "",
        userId: "",
        userIdGroup: "",
        sellerId: "",
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated,
        loading,
        loadingAuth,
        credentialsMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
