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

  getModelos: publicProcedure
  // Recebe o código da marca como entrada
  .input(z.object({ codigoMarca: z.string() }))
  .query(async ({ input }) => {
    const { codigoMarca } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // A resposta da API tem a estrutura { modelos: [], anos: [] }
      return data.modelos; // Retorna os dados dos modelos
    } catch (error) {
      console.error("Erro ao buscar modelos da FIPE:", error);
      throw new Error("Não foi possível carregar os modelos de veículos. Tente novamente mais tarde.");
    }
  }),

  getAnos: publicProcedure
  // Recebe o código da marca e do modelo como entrada
  .input(z.object({ codigoMarca: z.string(), codigoModelo: z.string() }))
  .query(async ({ input }) => {
    const { codigoMarca, codigoModelo } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      return data; // Retorna os dados dos anos
    } catch (error) {
      console.error("Erro ao buscar anos da FIPE:", error);
      throw new Error("Não foi possível carregar os anos de veículos. Tente novamente mais tarde.");
    }
  }),

  getValor: publicProcedure
  // Recebe o código da marca, do modelo e do ano como entrada
  .input(z.object({ codigoMarca: z.string(), codigoModelo: z.string(), codigoAno: z.string() }))
  .query(async ({ input }) => {
    const { codigoMarca, codigoModelo, codigoAno } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      return data; // Retorna os dados do valor
    } catch (error) {
      console.error("Erro ao buscar valor da FIPE:", error);
      throw new Error("Não foi possível carregar o valor do veículo. Tente novamente mais tarde.");
    }
  }),
});
