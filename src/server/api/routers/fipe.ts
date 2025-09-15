import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

// Criação do roteador para a API FIPE
export const fipeRouter = createTRPCRouter({

  // Procedimento para obter as marcas dos carros
  getBrands: publicProcedure
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

  getModels: publicProcedure
  // Recebe o código da marca como entrada
  .input(z.object({ brandCode: z.string() }))
  .query(async ({ input }) => {
    const { brandCode } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos`;

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

  getYears: publicProcedure
  // Recebe o código da marca e do modelo como entrada
  .input(z.object({ brandCode: z.string(), modelCode: z.string() }))
  .query(async ({ input }) => {
    const { brandCode, modelCode} = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${modelCode}/anos`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      return data; // Retorna os dados dos anos
    } catch (error) {
      console.error("Erro ao buscar anos da FIPE:", error);
      throw new Error("Não foi possível carregar os anos de veículos. Tente novamente mais tarde.");
    }
  }),

  getPrice: publicProcedure
  // Recebe o código da marca, do modelo e do ano como entrada
  .input(z.object({ brandCode: z.string(), modelCode: z.string(), yearCode: z.string() }))
  .query(async ({ input }) => {
    const { brandCode, modelCode, yearCode } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;

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
