'use client'

import { api } from "~/trpc/react";

export default function Home() {
  // Hook do tRPC para chamar o procedimento getMarcas do "router" fipe
  const { data: marcas, isLoading, error } = api.fipe.getMarcas.useQuery();

  if (isLoading) return <div>Carregando marcas...</div>;

  if (error) return <div>Erro ao carregar marcas: {error.message}</div>;

  return (
    <div>
      <h1>Marcas de Carros</h1>
      <ul>
        {marcas?.map((marca: { codigo: string; nome: string }) => (
          <li key={marca.codigo}>
            {marca.nome} (Código: {marca.codigo})
          </li>
        ))}
      </ul>
    </div>
  );
}
