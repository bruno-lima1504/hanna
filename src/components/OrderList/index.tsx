import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamProducts } from "../../routes/separacao.routes";
// Definindo o tipo de dados que o 'data' contém
type OrderProps = {
  id_pedidos: string;
  num_pedido: string;
  cod_cliente: string;
  loja: string;
  data_liberacao: string;
  quantidade_itens: string;
  status_separacao: string;
  controle_qualidade: string;
  libera_cont_qual: string;
};

// Tipagem para o componente
type OrderListProps = {
  data: OrderProps;
};

// Definir o tipo para a navegação com parâmetros
type SeparacaoScreenNavigationProp = NavigationProp<RootStackParamProducts>;

export default function OrderList({ data }: OrderListProps) {
  // Tipagem da navegação
  const navigation = useNavigation<SeparacaoScreenNavigationProp>();

  // Função para separar os pedidos com base no status
  function separeteOrders(order: string) {
    // Mapear os status para as rotas
    const status: Record<string, keyof RootStackParamProducts> = {
      BQ: "Separar",
      RP: "Trocar",
      CF: "Conferir",
      RC: "ConferirCQ",
    };

    const routeName = status[data.status_separacao];

    if (routeName) {
      // Navegar para a rota correspondente, passando o pedido como parâmetro
      navigation.navigate(routeName, {
        pedido: order, // Aqui o parâmetro 'pedido' é enviado para a rota
      });
    }
  }

  // Função para formatar a data
  function formatarData(data: string) {
    const ano = data.substring(0, 4);
    const mes = data.substring(4, 6);
    const dia = data.substring(6, 8);
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        separeteOrders(data.id_pedidos);
      }}
    >
      <Text style={styles.orderNum}>Pedido: {data.num_pedido}</Text>
      <Text style={styles.bodyText}>
        Cliente: {data.cod_cliente} - Loja: {data.loja}
      </Text>
      <Text style={styles.bodyText}>
        Data Liberação: {formatarData(data.data_liberacao)}
      </Text>
      <Text style={styles.bodyText}>Quantidade: {data.quantidade_itens}</Text>
      {data.controle_qualidade === "1" && data.libera_cont_qual !== "0" && (
        <Text style={styles.alertText}>
          Existem Produtos aguardando liberação
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    height: 150,
    width: 300,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginTop: 15,
    borderRadius: 4,
  },
  orderNum: {
    fontSize: 20,
    marginBottom: 5,
    padding: 5,
    fontWeight: "bold",
  },
  bodyText: {
    margin: 5,
  },
  alertText: {
    color: "red",
    fontWeight: "bold",
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
});
