'use client'

import { useState } from "react";
import { FinancialSimulator } from "~/components/FinancialSimulator";
import { ValuationSimulator } from "~/components/ValuationSimulator";
import { VehicleSearch } from "~/components/VehicleSearch";
import { ContactForm } from "~/components/ContactForm";

import { api } from "~/trpc/react";

export default function HomePage() {
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);

  const { data: vehicleData, isLoading: isLoadingValor } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );
  
  // Use uma variável para o valor, para evitar erros de tipagem e de acesso
  const vehiclePrice = vehicleData ? vehicleData.Valor : null;

  return (
    <main className="container mx-auto p-4">
      <VehicleSearch onVehicleSelected={setSelectedVehicleData} />

      {isLoadingValor && <p className="text-center">Carregando valor FIPE...</p>}
      
      {vehiclePrice && (
        <section className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Detalhes do Veículo</h2>
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700">Valor FIPE:</p>
            <p className="text-4xl font-extrabold text-blue-600 mt-1">{vehiclePrice}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValuationSimulator fipePrice={vehiclePrice} />
            <FinancialSimulator baseValue={vehiclePrice} />
          </div>
        </section>
      )}
    </main>
  );
}
