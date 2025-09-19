import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

// Aqui estamos criando o nosso "baú" para guardar os dados, famoso cache.
// É usado um `Map` do JavaScript, que é ótimo para armazenar pares de chave-valor (como uma etiqueta e o dado).
// A chave será uma string (ex: "brands-carros") e o valor será um objeto contendo os dados e quando foram guardados.
const cache = new Map<string, { timestamp: number; data: unknown }>();

// Esta é a "data de validade" dos nossos dados no cache, em segundos.
// 24 * 60 * 60 = 86400 segundos, que equivale a 24 horas.
// Depois desse tempo, vamos buscar os dados de novo para garantir que não fiquem muito antigos.
const CACHE_DURATION_SECONDS = 24 * 60 * 60;

/**
 * Esta função é o "gerente" do nosso cache. Ela decide se deve buscar dados
 * da internet ou se pode usar uma versão que já guardamos antes.
 *
 * @param key Uma "etiqueta" única para os dados que queremos buscar (ex: 'brands-carros').
 * @param url O endereço da API de onde vamos buscar os dados, caso não os tenhamos.
 * @param token O token para acessar a API (necessário para ter mais requisições).
 * @returns Os dados, ou do cache ou da API.
 */
async function fetchWithCache<T>(key: string, url: string, token: string | undefined): Promise<T> {
  const agora = Date.now();
  const itemEmCache = cache.get(key);

  // 1. VERIFICAR O CACHE
  // Primeiro, olhamos se já temos algo guardado com essa "etiqueta" e se ainda está dentro da validade.
  if (itemEmCache && (agora - itemEmCache.timestamp) / 1000 < CACHE_DURATION_SECONDS) {
    // Se entramos aqui, significa que encontramos os dados no cache e eles não expiraram.
    // Isso é um "Cache Hit"! Vamos retornar os dados guardados sem precisar ir na internet.
    // console.log(`[CACHE HIT] Usando dados do cache para a chave: ${key}`);
    return itemEmCache.data as T;
  }

  // 2. BUSCAR DADOS NOVOS (CACHE MISS)
  // Se não encontramos no cache ou se os dados expiraram, precisamos buscar na internet.
  // Isso é um "Cache Miss".
  // console.log(`[CACHE MISS] Buscando dados da API para a chave: ${key}`);
  const res = await fetch(url, {
    headers: {
      // Mantem o token, como o usuário pediu, para ter um limite maior de requisições.
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Se a requisição para a API falhar, é avisado no console e jogamos um erro para o usuário.
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Falha na API FIPE para a chave "${key}" com status ${res.status}:`, errorBody);
    throw new Error("Serviço de consulta de veículos indisponível no momento. Tente novamente mais tarde.");
  }

  const dados = await res.json() as T;

  // 3. GUARDAR OS DADOS NOVOS
  // Agora que temos dados novos, guardamos no nosso "baú" (o cache) para a próxima vez.
  // Armazenamos junto a data e hora de agora para sabermos quando ele vai expirar.
  cache.set(key, { timestamp: agora, data: dados });
  
  return dados;
}

const token = process.env.API_KEY;

interface FipePriceResponseData {
  Marca: string,
  Modelo: string;
  Combustivel: string;
  AnoModelo: number;
  CodigoFipe: string;
  Valor: string;
  MesReferencia: string;
}

// Criação do roteador para a API FIPE
export const fipeRouter = createTRPCRouter({
  // Procedimento para obter as marcas dos carros
  getBrands: publicProcedure
  .input(z.object({
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }).nullable())
  .query(async ({ input }) => {
    if (!input) return null;

    const { vehicleType } = input;
    const cacheKey = `brands-${vehicleType}`;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas`;

    type BrandData = { codigo: string; nome: string }[];
    return fetchWithCache<BrandData>(cacheKey, url, token);
  }),

  getModels: publicProcedure
  // Recebe o código da marca como entrada
  .input(z.object({ 
    brandCode: z.string(), 
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }).nullable())
  .query(async ({ input }) => {
    if (!input) return null;

    const { brandCode, vehicleType } = input;
    const cacheKey = `models-${vehicleType}-${brandCode}`;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos`;

    type ModelData = { modelos: { codigo: string; nome: string }[] };
    const data = await fetchWithCache<ModelData>(cacheKey, url, token);
    
    // A resposta da API tem a estrutura { modelos: [], anos: [] }
    return data.modelos; // Retorna os dados dos modelos
  }),

  getYears: publicProcedure
  // Recebe o código da marca e do modelo como entrada
  .input(z.object({ 
    brandCode: z.string(), 
    modelCode: z.coerce.string(),
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }).nullable())
  .query(async ({ input }) => {
    if (!input) return null;

    const { brandCode, modelCode, vehicleType} = input;
    const cacheKey = `years-${vehicleType}-${brandCode}-${modelCode}`;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos`;

    type YearData = { codigo: string; nome: string }[];
    return fetchWithCache<YearData>(cacheKey, url, token);
  }),

  getPrice: publicProcedure
  // Recebe o código da marca, do modelo e do ano como entrada
  .input(z.object({ 
    brandCode: z.string(),
    modelCode: z.coerce.string(),
    yearCode: z.string(),
    vehicleType: z.enum(['carros', 'motos', 'caminhoes']).default('carros'),
  }).nullable())
  .query(async ({ input }) => {
    if (!input) return null;

    const { brandCode, modelCode, yearCode, vehicleType } = input;
    const cacheKey = `price-${vehicleType}-${brandCode}-${modelCode}-${yearCode}`;
    const url = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;

    return fetchWithCache<FipePriceResponseData>(cacheKey, url, token);
  }),
});
