import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const token = process.env.API_KEY;

// Criação do roteador para a API FIPE
export const fipeRouter = createTRPCRouter({
  // Procedimento para obter as marcas dos carros
  getBrands: publicProcedure
  .input(z.object({
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }))
  .query(async ({ input }) => {
    const { vehicleType } = input;
    // Endpoint da API FIPE para obter as marcas dos carros
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas`;

    // Faz a requisição para a API FIPE
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json() as { codigo: string; nome: string }[];

      return data; // Retorna os dados das marcas
    } catch (error) {
      console.error("Erro ao buscar marcas da FIPE:", error);
      throw new Error("Não foi possível carregar as marcas de veículos. Tente novamente mais tarde.");
    }
  }),

  getModels: publicProcedure
  // Recebe o código da marca como entrada
  .input(z.object({ 
    brandCode: z.string(), 
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }))
  .query(async ({ input }) => {
    const { brandCode, vehicleType } = input;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos`;

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json() as { modelos: { codigo: string; nome: string }[]; anos: { codigo: string; nome: string }[] };

      // A resposta da API tem a estrutura { modelos: [], anos: [] }
      return data.modelos; // Retorna os dados dos modelos
    } catch (error) {
      console.error("Erro ao buscar modelos da FIPE:", error);
      throw new Error("Não foi possível carregar os modelos de veículos. Tente novamente mais tarde.");
    }
  }),

  getYears: publicProcedure
  // Recebe o código da marca e do modelo como entrada
  .input(z.object({ 
    brandCode: z.string(), 
    modelCode: z.coerce.string(),
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }))
  .query(async ({ input }) => {
    const { brandCode, modelCode, vehicleType} = input;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos`;

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json() as { codigo: string; nome: string }[];

      return data; // Retorna os dados dos anos
    } catch (error) {
      console.error("Erro ao buscar anos da FIPE:", error);
      throw new Error("Não foi possível carregar os anos de veículos. Tente novamente mais tarde.");
    }
  }),

  getPrice: publicProcedure
  // Recebe o código da marca, do modelo e do ano como entrada
  .input(z.object({ 
    brandCode: z.string().optional(), 
    modelCode: z.coerce.string().optional(),
    yearCode: z.string().optional(),
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }))
  .query(async ({ input }) => {

      const { brandCode, modelCode, yearCode, vehicleType } = input;
      const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      return data; // Retorna os dados do valor
    } catch (error) {
      console.error("Erro ao buscar valor da FIPE:", error);
      throw new Error("Não foi possível carregar o valor do veículo. Tente novamente mais tarde.");
    }
  }),
});
