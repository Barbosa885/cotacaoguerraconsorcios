'use client'

import { ArrowRight, Sparkles, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CarDetailsCard, SkeletonCarDetailsCard } from "~/components/CarDetailsCard";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import { VehicleSearch, type VehicleType } from "~/components/VehicleSearch";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

type VehicleDataType = {
  Modelo: string;
  Combustivel: string;
  CodigoFipe: string;
  AnoModelo: number;
  MesReferencia?: string;
  Valor: string;
  Marca: string;
};

type SelectedVehicleDataType = {
  vehicleType: VehicleType;
  brandCode: string;
  modelCode: string;
  yearCode: string;
} | null;

// Componente para exibir o histórico
const SearchHistoryList = () => {
  const { data: history, isLoading } = api.searchHistory.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return <p className="text-center text-sm text-gray-500">Nenhuma busca recente encontrada.</p>;
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
          <div>
            <p className="font-semibold">{item.modelName}</p>
            <p className="text-sm text-gray-600">{item.brandName} - {item.year}</p>
          </div>
          <Badge variant="outline" className="text-blue-700">{item.price}</Badge>
        </div>
      ))}
    </div>
  );
};

export default function PricePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedVehicleData, setSelectedVehicleData] = useState<SelectedVehicleDataType>(null);

  const { data: vehicleData, isLoading: isLoadingValor } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  const addSearchHistory = api.searchHistory.add.useMutation();

  useEffect(() => {
    if (vehicleData && status === 'authenticated') {
      addSearchHistory.mutate({
        vehicleType: selectedVehicleData!.vehicleType,
        brandName: vehicleData.Marca,
        modelName: vehicleData.Modelo,
        year: vehicleData.AnoModelo.toString(),
        price: vehicleData.Valor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleData, status]); // Deliberately not including addSearchHistory to avoid re-triggering

  const handleNavigateToEvaluation = (vehicleData: VehicleDataType, selectedVehicleData: SelectedVehicleDataType) => {
    if (!vehicleData || !selectedVehicleData) return '#';

    const params = new URLSearchParams({
      vehicleType: selectedVehicleData.vehicleType,
      brandCode: selectedVehicleData.brandCode,
      modelCode: selectedVehicleData.modelCode,
      yearCode: selectedVehicleData.yearCode,
      modelo: vehicleData.Modelo,
      combustivel: vehicleData.Combustivel,
      ano: vehicleData.AnoModelo.toString(),
      codigoFipe: vehicleData.CodigoFipe,
      valor: vehicleData.Valor.replace(/[^\d,]/g, '').replace(',', '.'),
      valorFormatado: vehicleData.Valor,
      referencia: vehicleData.MesReferencia ?? ''
    });
    
    router.push(`/avaliacao-simulacao?${params.toString()}`);
  };

  return (
    <div className="flex flex-col justify-center mx-auto min-h-screen max-w-7xl p-4">
      <div className="grid grid-cols-1 gap-12">
        {/* Coluna Principal */}
        <div className="">
          <div className="flex flex-col items-center">
            <h1 className="mb-4 text-center text-4xl font-bold">Consulta de preço FIPE</h1>
            <p className="mb-6 max-w-2xl text-center text-gray-500">
              Selecione a marca, modelo e ano do veículo. Use a busca para encontrar mais rápido.
            </p>
          </div>
          <VehicleSearch onVehicleSelected={setSelectedVehicleData} />

          <div className="mt-8">
            {!selectedVehicleData && !isLoadingValor && <EmptyState />}
            {isLoadingValor && <SkeletonCarDetailsCard />}

            {vehicleData && 
              <div>
                <CarDetailsCard vehicleData={vehicleData} />
                <p className="mt-4 text-center text-sm font-light text-gray-400">
                  * Faça a avaliação do seu veículo ou simule um financiamento abaixo.
                </p>
                <div className="mt-14 flex justify-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-700 px-4 py-6 text-lg font-semibold text-white hover:bg-blue-800"
                    onClick={() => handleNavigateToEvaluation(vehicleData, selectedVehicleData!)}
                  >
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                      Avalie seu veículo ou Simule um financiamento
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Coluna do Histórico */}
        <div className="flex flex-col w-full items-center">
          <div className="max-w-xl lg:min-w-2xl">
            {status === 'authenticated' && (
              <Card className="sticky">
                <CardHeader>
                  <CardTitle className="flex justify-center items-center">
                    <History className="mr-2 h-5 w-5" />
                    Histórico de Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchHistoryList />
                </CardContent>
              </Card>
            )}
            {status === 'unauthenticated' && (
               <Card className="sticky border-dashed">
                <CardHeader>
                  <CardTitle className="flex justify-center items-center text-gray-600">
                    <History className="mr-2 h-5 w-5" />
                    Histórico de Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500">Faça login para ver seu histórico de consultas.</p>
                  <Button onClick={() => router.push('/login')} className="mt-4">Fazer Login</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
