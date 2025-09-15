"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Props que o componente vai receber
interface VehicleSearchProps {
  onVehicleSelected: (data: { brandCode: string; modelCode: string; yearCode: string; } | null) => void;
}

export const VehicleSearch = ({ onVehicleSelected }: VehicleSearchProps) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { data: brands, isLoading: isLoadingBrands } = api.fipe.getBrands.useQuery();
  const { data: models, isLoading: isLoadingModels } = api.fipe.getModels.useQuery(
    { brandCode: selectedBrand },
    { enabled: !!selectedBrand }
  );
  const { data: years, isLoading: isLoadingYears } = api.fipe.getYears.useQuery(
    { brandCode: selectedBrand, modelCode: selectedModel },
    { enabled: !!selectedModel && !!selectedModel }
  );
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedYear) {
      onVehicleSelected({
        brandCode: selectedBrand,
        modelCode: selectedModel,
        yearCode: selectedYear
      });
    } else {
      onVehicleSelected(null);
    }
  }, [selectedBrand, selectedModel, selectedYear, onVehicleSelected]);

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Consulta de preço</h2>
          <p className="text-lg text-gray-300">
            Selecione primeiro a marca do veículo e, em seguida, o modelo e o ano conforme sua
            preferência. Você também pode utilizar o campo "busca" em cada etapa do formulário para
            localizar a informação desejada mais rapidamente.
          </p>
        </div>

        <div className="flex gap-4 max-w-md mx-auto">
          <Select onValueChange={(value) => setSelectedBrand(value)} value={selectedBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a Marca" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingBrands ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                brands?.map((brand) => (
                  <SelectItem key={brand.codigo} value={brand.codigo}>{brand.nome}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedBrand && (
            <Select onValueChange={(value) => setSelectedModel(value)} value={selectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o Modelo" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModels ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  models?.map((model) => (
                    <SelectItem key={model.codigo} value={model.codigo}>{model.nome}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}

          {selectedModel && (
            <Select onValueChange={(value) => setSelectedYear(value)} value={selectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o Ano" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingYears ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  years?.map((year) => (
                    <SelectItem key={year.codigo} value={year.codigo}>{year.nome}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};
