'use client'

import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { CarDetailsCard, SkeletonCarDetailsCard } from "~/components/CarDetailsCard";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import { VehicleSearch } from "~/components/VehicleSearch";

import { api } from "~/trpc/react";

export default function PricePage() {
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);

  const { data: vehicleData, isLoading: isLoadingValor } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  return (
    <div className="flex flex-col min-h-screen justify-center mx-auto p-4 bg-gray-50">
      <div className="flex flex-col items-center max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Consulta de preço</h1>
        <p className="flex text-center max-w-2xl text-gray-500 mb-6">
          Selecione primeiro a marca do veículo e, em seguida, o modelo e o ano conforme sua preferência. Você também pode utilizar o campo "busca" em cada etapa do formulário para localizar a informação desejada mais rapidamente.
        </p>
      </div>
      <VehicleSearch onVehicleSelected={setSelectedVehicleData} />

      {!selectedVehicleData && !isLoadingValor && <EmptyState />}
      {isLoadingValor && <SkeletonCarDetailsCard />}

      {vehicleData && 
        <div>
          <div>
            <CarDetailsCard vehicleData={vehicleData} />
            <p className="mt-4 text-center text-gray-400 text-sm font-light">
              * Faça a avaliação do seu veículo ou simule um financiamento abaixo.
            </p>
          </div>
          <div className="mt-14 flex justify-center">
            <Button size="lg" className="px-4 py-6 text-lg font-semibold bg-blue-700 text-white hover:bg-blue-800">
              <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
              Avalie seu veículo ou Simule um financiamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      }
    </div>
  );
}
