'use client'

import React, { Suspense } from 'react';

// Icones
import { Car, Info, Sparkles } from 'lucide-react';

// Componentes e hooks
import { useVehicleData } from './_hooks/useVehicleData';
import { VehicleEvaluationCard } from './_components/VehicleEvaluationCard';
import { FipeValueCard } from './_components/FipeValueCard';
import { FinancingSimulatorCard } from './_components/FinancingSimulatorCard';
import { VehicleSearch } from '~/components/VehicleSearch';

// Shadcn
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Alert, AlertDescription } from '~/components/ui/alert';

const EvaluationLoading = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-24 w-full mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

const VehicleEvaluationContent = () => {
  const { vehicleData, isLoadingPrice, setSelectedVehicleData, initialVehicleSelection } = useVehicleData();

  const hasVehicleData = vehicleData?.modelo && vehicleData.valorNumerico > 0;

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-26">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Avalie seu Veículo ou Simule um Financiamento</h1>
            <p className="text-lg text-gray-600">Descubra o valor do seu veículo e simule as melhores condições de financiamento</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center"><Car className="mr-2 h-5 w-5" />Selecione o Veículo</CardTitle>
              <p className="text-sm text-gray-600">Escolha o tipo, marca, modelo e ano do veículo para começar</p>
            </CardHeader>
            <CardContent>
              <VehicleSearch onVehicleSelected={setSelectedVehicleData} initialData={initialVehicleSelection} />
              {isLoadingPrice && (
                <div className="mt-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>Carregando informações do veículo...</AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {hasVehicleData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VehicleEvaluationCard vehicleData={vehicleData} />

              <div className="space-y-6">
                <FipeValueCard vehicleData={vehicleData} />
                <FinancingSimulatorCard vehiclePrice={vehicleData.valorNumerico} />
              </div>
            </div>
          )}

          {!hasVehicleData && !isLoadingPrice && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comece selecionando um veículo</h3>
              <p className="text-gray-500 mb-4 max-w-sm">Use o formulário acima para escolher o veículo que deseja avaliar.</p>
            </div>
          )}
        </div>
      </div>
  );
};

const VehicleEvaluationPage = () => {
  return (
    <Suspense fallback={<EvaluationLoading />}>
      <VehicleEvaluationContent />
    </Suspense >
  )
}

export default VehicleEvaluationPage;
