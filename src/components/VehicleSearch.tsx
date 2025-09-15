"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

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
    <div className="mb-8">
      <h2>Busca de Veículo</h2>
      <select onChange={(e) => setSelectedBrand(e.target.value)}>
        <option value="">Selecione a Marca</option>
        {isLoadingBrands && <option>Carregando...</option>}
        {brands?.map((brand) => (
          <option key={brand.codigo} value={brand.codigo}>{brand.nome}</option>
        ))}
      </select>

      {selectedBrand && (
        <select onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="">Selecione o Modelo</option>
          {isLoadingModels && <option>Carregando...</option>}
          {models?.map((model) => (
            <option key={model.codigo} value={model.codigo}>{model.nome}</option>
          ))}
        </select>
      )}

      {selectedModel && (
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Selecione o Ano</option>
          {isLoadingYears && <option>Carregando...</option>}
          {years?.map((year) => (
            <option key={year.codigo} value={year.codigo}>{year.nome}</option>
          ))}
        </select>
      )}
    </div>
  );
};
