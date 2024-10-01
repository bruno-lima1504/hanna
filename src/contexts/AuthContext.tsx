import React, { useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../services/api";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  loading: boolean;
  loadingAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  credentialsMsg: boolean;
  signOut: () => Promise<void>;
  getOrders: () => Promise<OrderProps[] | undefined>;
  cleanRespOrder: () => Promise<void>;
  getProductOrder: (
    pedido: string
  ) => Promise<ProductOrderResponse | undefined>;
  saveSeparateProducts: (
    produtcs: ProductProps[]
  ) => Promise<number | undefined>;
  printTag: (
    numPed: string,
    qtd: string,
    idPedido: string
  ) => Promise<PrintTagResponse>;
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

export type OrderProps = {
  id_pedidos: string;
  num_pedido: string;
  quantidade_itens: string;
  filial: string;
  cod_cliente: string;
  loja: string;
  data_liberacao: string;
  status_separacao: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  controle_qualidade: string;
  analise_fiscal: string;
  calibracao: string;
  responsavel: string | null;
  prioridade: string;
  libera_cont_qual: string | null;
};

export type ProductProps = {
  num_pedido: string;
  id_pedidos: string;
  id_produtos_pedido: string;
  cod_prod: string;
  seqcb: string;
  controle_qualidade: string;
  num_serie: string | null;
  lote: string | null;
  validade: string | null;
  origem: string | null;
  localizacao: string;
  calibracao: string;
  status_produto_atual: string;
  prod_desc: string;
};

export type CardItemProps = {
  cod_prod: string;
  qtd_total: string;
  localizacao: string;
  prod_desc: string;
  qtd_leituras: string;
};

export type ProductOrderResponse = {
  itens_pedido: ProductProps[];
  itens_card: CardItemProps[];
};

type PrintTagSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    pedido: string;
    name: string;
  };
};

type ApiErrorResponse = {
  message: string;
};

type PrintTagResponse = PrintTagSuccessResponse | ApiErrorResponse | undefined;

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

  async function getOrders(): Promise<OrderProps[] | undefined> {
    const userInfo = await AsyncStorage.getItem("@hanna");
    let user = JSON.parse(userInfo || "{}");
    try {
      const response = await api.post("/separacao", {
        id_login: user.userId.toString(),
      });
      if (response.status === 200) {
        return response.data as OrderProps[];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async function cleanRespOrder(): Promise<void> {
    try {
      await api.put("/clearorderlist", {
        id_login: user.userId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getProductOrder(
    pedido: string
  ): Promise<ProductOrderResponse | undefined> {
    try {
      const response = await api.post("/separar", {
        pedido: pedido,
      });
      const responseData: ProductOrderResponse = response.data;
      return responseData;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async function saveSeparateProducts(
    products: ProductProps[]
  ): Promise<number | undefined> {
    try {
      const userInfo = await AsyncStorage.getItem("@hannaStorage");
      let user = JSON.parse(userInfo || "{}");
      let dados = {
        products: products,
        user: user,
      };
      console.log(dados);
      const response = await api.put("/savesepareteproducts", dados);
      const status = response.status;
      return status;
    } catch (error) {
      if (error.response) {
        // Erro de resposta do servidor
        console.log("Erro:", error.response.status);
      } else {
        // Erro de configuração da solicitação ou outro erro
        console.log("Erro:", error.message);
      }

      return undefined;
    }
  }

  async function printTag(
    numPed: string,
    qtd: string,
    idPedido: string
  ): Promise<PrintTagResponse> {
    const userInfo = await AsyncStorage.getItem("@hanna");
    let user = JSON.parse(userInfo || "{}");

    const print = {
      pedido: `${idPedido}:${numPed}`,
      name: user.name,
      quantidade: qtd,
    };
    console.log(print);

    try {
      const response = await api.post("/etiqueta", { print });

      // Retorna a resposta de sucesso tipada corretamente
      return response.data as PrintTagSuccessResponse;
    } catch (error: any) {
      if (error.response) {
        // Retorna um erro tipado corretamente
        console.log(error.response.data.message);
        return { message: error.response.data.message } as ApiErrorResponse;
      } else {
        console.log("Erro:", error.message);
      }
      return undefined; // Retorna undefined em caso de erro
    }
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
        getOrders,
        cleanRespOrder,
        getProductOrder,
        saveSeparateProducts,
        printTag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
