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
import { Skeleton } from "./ui/skeleton";

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

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel("");
    setSelectedYear("");
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedYear("");
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  }

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
      <div className="container mx-auto">
        <div className="flex gap-4 mx-auto max-w-4xl">

          <Select onValueChange={handleBrandChange} value={selectedBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a Marca" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingBrands ? (
                <div className="p-4">
                  <Skeleton className="h-8 w-full mb-1" />
                  <Skeleton className="h-8 w-full mb-1" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                brands?.map((brand) => (
                  <SelectItem key={brand.codigo} value={brand.codigo}>{brand.nome}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select 
            onValueChange={handleModelChange} 
            value={selectedModel}
            disabled={!selectedBrand}
          >
            <SelectTrigger className={`w-full ${!selectedBrand ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <SelectValue placeholder="Selecione o Modelo" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingModels ? (
                <div className="p-4">
                  <Skeleton className="h-8 w-full mb-1"/>
                  <Skeleton className="h-8 w-full mb-1"/>
                  <Skeleton className="h-8 w-full"/>
                </div>
              ) : selectedBrand ? (
                models?.map((model) => (
                  <SelectItem key={model.codigo} value={model.codigo}>{model.nome}</SelectItem>
                )) || (
                  <div className="p-4 text-sm text-gray-500">Nenhum modelo encontrado</div>
                )
              ) : (
                <div className="p-4 text-sm text-gray-500">Selecione uma marca primeiro</div>
              )}
            </SelectContent>
          </Select>
          
            <Select 
              onValueChange={handleYearChange} 
              value={selectedYear}
              disabled={!selectedModel || !selectedBrand}
            >
              <SelectTrigger className={`w-full ${!selectedModel || !selectedBrand ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder="Selecione o Ano" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingYears ? (
                  <div className="p-4">
                    <Skeleton className="h-8 w-full mb-1" />
                    <Skeleton className="h-8 w-full mb-1" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : selectedBrand && selectedModel ? (
                  years?.map((year) => (
                    <SelectItem key={year.codigo} value={year.codigo}>{year.nome}</SelectItem>
                  )) || (
                    <div className="p-4 text-sm text-gray-500">Nenhum ano encontrado</div>
                  )
                ) : (
                  <div className="p-4 text-sm text-gray-500">Selecione um modelo primeiro</div>
                )}
              </SelectContent>
            </Select>
        </div>
      </div>
  );
};
