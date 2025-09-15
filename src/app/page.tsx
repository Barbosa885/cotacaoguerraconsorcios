'use client'

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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

  const { data: vehicleDetails, isLoading: isLoadingVehicleDetails, error: vehicleDetailsError } = api.fipe.getPrice.useQuery(
    { brandCode: selectedBrand, modelCode: selectedModel, yearCode: selectedYear },
    { enabled: !!selectedBrand && !!selectedModel && !!years } // Só faz a requisição quando marca, modelo e ano estiverem selecionados
  );

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
        <select onChange={(e) => setSelectedYear(e.target.value)}>
          <option>Selecione o Ano</option>
          {isLoadingYears && <option>Carregando...</option>}
          {years?.map((year) => (
            <option key={year.codigo} value={year.codigo}>
              {year.nome}
            </option>
          ))}
        </select>
      )}

      {selectedYear && (
        <div>
          {isLoadingVehicleDetails && <p>Carregando detalhes do veículo...</p>}
          {vehicleDetailsError && <p>Erro ao carregar detalhes do veículo: {vehicleDetailsError.message}</p>}
          {vehicleDetails && (
            <div>
              <h2>Detalhes do Veículo</h2>
              <p>Marca: {vehicleDetails.Marca}</p>
              <p>Modelo: {vehicleDetails.Modelo}</p>
              <p>Ano: {vehicleDetails.AnoModelo}</p>
              <p>Combustível: {vehicleDetails.Combustivel}</p>
              <p>Código Fipe: {vehicleDetails.CodigoFipe}</p>
              <p>Preço: {vehicleDetails.Valor}</p>
              <p>Mês de Referência: {vehicleDetails.MesReferencia}</p>
              <p>Tipo de Combustível: {vehicleDetails.TipoVeiculo === 1 ? 'Carro' : vehicleDetails.TipoVeiculo === 2 ? 'Moto' : 'Caminhão'}</p>
              <p>Símbolo de Combustível: {vehicleDetails.SiglaCombustivel}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
