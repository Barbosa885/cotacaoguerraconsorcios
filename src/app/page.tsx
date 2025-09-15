'use client'

import { useState } from "react";
import { VehicleSearch } from "~/components/VehicleSearch";
import { api } from "~/trpc/react";

export default function HomePage() {
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);

  // Aqui você continua a usar o tRPC para buscar o valor do veículo,
  // mas agora com os dados que vêm do componente filho
  const { data: valorVeiculo, isLoading: isLoadingValor } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  return (
    <main>
      <h1>Avaliação e Financiamento de Veículos</h1>
      <VehicleSearch onVehicleSelected={setSelectedVehicleData} />

      {isLoadingValor && <p>Carregando valor FIPE...</p>}
      
      {valorVeiculo && (
        <section>
          <h2>Detalhes do Veículo</h2>
          <p>Valor FIPE: {valorVeiculo.Valor}</p>
          
          {/* Aqui você vai adicionar os próximos componentes: */}
          {/* <ValuationSimulator valorFipe={valorVeiculo.Valor} /> */}
          {/* <FinancialSimulator valorBase={valorVeiculo.Valor} /> */}
        </section>
      )}
    </main>
  );
}
