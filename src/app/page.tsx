'use client'

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Hook do tRPC para chamar o procedimento getMarcas do "router" fipe
  const { data: brands, isLoading: isLoadingBrands, error } = api.fipe.getBrands.useQuery();

  const { data: models, isLoading: isLoadingModels, error: modelosError } = api.fipe.getModels.useQuery(
    { brandCode: selectedBrand },
    { enabled: !!selectedBrand, } // Só faz a requisição se uma marca estiver selecionada 
  );

  const { data: years, isLoading: isLoadingYears, error: anosError } = api.fipe.getYears.useQuery(
    { brandCode: selectedBrand, modelCode: selectedModel },
    { enabled: !!selectedBrand && !!selectedModel } // Só faz a requisição quando marca e modelo estiverem selecionadas
  );

  if (isLoadingBrands) return <div>Carregando marcas...</div>;

  if (error) return <div>Erro ao carregar marcas: {error.message}</div>;

  return (
    <div>
      <select onChange={(e) => setSelectedBrand(e.target.value)}>
        <option>Selecione a Marca</option>
        {isLoadingBrands && <option>Carregando...</option>}
        {brands?.map((brand) => (
          <option key={brand.codigo} value={brand.codigo}>
            {brand.nome}
          </option>
        ))}
      </select>

      {selectedBrand && (
        <select onChange={(e) => setSelectedModel(e.target.value)}>
          <option>Selecione o Modelo</option>
          {isLoadingModels && <option>Carregando...</option>}
          {models?.map((model) => (
            <option key={model.codigo} value={model.codigo}>
              {model.nome}
            </option>
          ))}
        </select>
      )}

      {selectedModel && (
        <select>
          <option>Selecione o Ano</option>
          {isLoadingYears && <option>Carregando...</option>}
          {years?.map((year) => (
            <option key={year.codigo} value={year.codigo}>
              {year.nome}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
