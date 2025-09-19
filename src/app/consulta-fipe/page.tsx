'use client'

import { ArrowRight, Sparkles, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import { VehicleSearch, type VehicleType } from "~/components/VehicleSearch";
import { api } from "~/trpc/react";
import { SearchHistoryList } from "./_components/SearchHistoryList";
import { SkeletonCarDetailsCard } from "./_components/SkeletonCarDetailsCard";
import { CarDetailsCard } from "./_components/CarDetailsCard";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
import { cn } from "~/lib/utils";

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

export default function PricePage() {
  const router = useRouter();
  const { status } = useSession();
  const [selectedVehicleData, setSelectedVehicleData] = useState<SelectedVehicleDataType>(null);

  const utils = api.useUtils();

  const { mutate: addSearchHistory } = api.searchHistory.add.useMutation({
    onSuccess: async () => {
      await utils.searchHistory.list.invalidate();
    },
    onError: (error) => {
      console.error('Falha na requisição de histórico:', error);
    },
  });

  const { data: vehicleData, isLoading: isLoadingValor } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    {
      enabled: !!selectedVehicleData,
    }
  );

  useEffect(() => {
    if (vehicleData && status === 'authenticated' && selectedVehicleData) {
      addSearchHistory({
        vehicleType: selectedVehicleData.vehicleType,
        brandName: vehicleData.Marca,
        modelName: vehicleData.Modelo,
        year: vehicleData.AnoModelo.toString(),
        price: vehicleData.Valor,
      })
    }
  }, [vehicleData, status, selectedVehicleData, addSearchHistory]);

  const handleNavigateToEvaluation = (vehicleData: VehicleDataType, selectedVehicleData: SelectedVehicleDataType) => {
    if (!vehicleData || !selectedVehicleData) return '#';

    const params = new URLSearchParams({
      vehicleType: selectedVehicleData.vehicleType,
      brandCode: selectedVehicleData.brandCode,
      modelCode: selectedVehicleData.modelCode,
      yearCode: selectedVehicleData.yearCode,
      marca: vehicleData.Marca,
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
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center p-4 pt-24">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 w-full">
          <div
            className={cn(
              "text-center",
              vehicleData && "hidden md:block"
            )}
          >
            <h1 className="text-3xl font-bold sm:text-4xl">Consulta de preço FIPE</h1>
            <p className="mx-auto mb-8 max-w-2xl text-center text-sm md:text-base text-gray-500 lg:text-lg">
              Selecione primeiro a marca do veículo e, em seguida, o modelo e o ano conforme sua preferência.
            </p>
          </div>
          <div className="absolute right-0 top-0">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <History className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Histórico</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="flex items-center justify-center">
                    <History className="mr-2 h-5 w-5" />
                    Histórico de Consultas
                  </DrawerTitle>
                </DrawerHeader>
                <div className="mt-4 px-4 pb-8">
                  {status === 'authenticated' ? (
                    <SearchHistoryList />
                  ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                      <p className="text-sm text-gray-500">Faça login para ver seu histórico de consultas.</p>
                      <Button onClick={() => router.push('/login')} className="mt-4">Fazer Login</Button>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      <VehicleSearch onVehicleSelected={setSelectedVehicleData} />

      <div className="mt-8">
        {!selectedVehicleData && !isLoadingValor && <EmptyState subText="Selecione o tipo de veículo, marca, modelo e ano para consultar o valor atualizado na tabela FIPE." text="Nenhum veículo selecionado" />}
        {isLoadingValor && <SkeletonCarDetailsCard />}

        {vehicleData &&
          <div className="mt-6 flex flex-col items-center">
            <CarDetailsCard vehicleData={vehicleData} />
            <p className="mt-4 text-center text-sm font-light text-gray-400">
              * Faça a avaliação do seu veículo ou simule um financiamento abaixo.
            </p>
            <div className="mt-8 flex w-full justify-center">
              <Button
                size="lg"
                className="w-full max-w-md bg-blue-700 px-4 py-6 text-lg font-semibold text-white hover:bg-blue-800"
                onClick={() => handleNavigateToEvaluation(vehicleData, selectedVehicleData)}
              >
                <span className="flex items-center justify-center">
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
  );
}
