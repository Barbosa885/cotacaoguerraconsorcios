'use client'

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { CarDetailsCard, SkeletonCarDetailsCard } from "~/components/CarDetailsCard";
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
      <h1 className="text-4xl font-bold text-center mb-8">Consulta de preço</h1>
      <VehicleSearch onVehicleSelected={setSelectedVehicleData} />
      {isLoadingValor && <SkeletonCarDetailsCard />}

      {vehicleData && 
        <div>
          <div>
            <CarDetailsCard vehicleData={vehicleData} />
            <p className="mt-4 text-center text-gray-400">
              * Os valores apresentados são baseados na Tabela FIPE e podem variar conforme o estado de conservação do veículo e outros fatores.
            </p>
          </div>
          <div className="mt-24 flex justify-center">
            <Button size="lg" className="px-4 py-6 text-lg font-semibold bg-blue-700 text-white hover:bg-blue-800">
              Avalie seu veículo ou Simule um financiamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      }
    </div>
  );
}
