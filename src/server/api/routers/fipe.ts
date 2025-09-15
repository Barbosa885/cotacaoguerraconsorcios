import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

// Criação do roteador para a API FIPE
export const fipeRouter = createTRPCRouter({

  // Procedimento para obter as marcas dos carros
  getMarcas: publicProcedure
  .query(async () => {
    // Endpoint da API FIPE para obter as marcas dos carros
    const url = "https://parallelum.com.br/fipe/api/v1/carros/marcas";

    // Faz a requisição para a API FIPE
    try {
      const res = await fetch(url);
      const data = await res.json();

      return data; // Retorna os dados das marcas
    } catch (error) {
      console.error("Erro ao buscar marcas da FIPE:", error);
      throw new Error("Não foi possível carregar as marcas de veículos. Tente novamente mais tarde.");
    }
  }),
});
