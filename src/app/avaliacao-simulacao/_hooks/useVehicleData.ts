import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import type { VehicleType } from '~/components/VehicleSearch';

export type VehicleData = {
  modelo: string;
  combustivel: string;
  ano: string;
  codigoFipe: string;
  valor: string;
  valorFormatado: string;
  valorNumerico: number;
  referencia: string;
  marca: string;
} | null;

export type SelectedVehicleData = {
  modelCode: string;
  yearCode: string;
  brandCode: string;
  vehicleType: VehicleType;
} | null;

export const useVehicleData = () => {
  const searchParams = useSearchParams();
  
  const [vehicleData, setVehicleData] = useState<VehicleData>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<SelectedVehicleData>(null);

  const vehicleType = searchParams.get('vehicleType') as VehicleType | null;
  const brandCode = searchParams.get('brandCode');
  const modelCode = searchParams.get('modelCode');
  const yearCode = searchParams.get('yearCode');

  const initialVehicleSelection = 
    (vehicleType && brandCode && modelCode && yearCode)
      ? { vehicleType, brandCode, modelCode, yearCode }
      : null;

  const { data: fetchedVehicleData, isLoading: isLoadingPrice } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  useEffect(() => {
    // Prioriza os dados buscados por uma seleção na página
    if (fetchedVehicleData) {
      const valorNumerico = parseFloat(
        fetchedVehicleData.Valor?.replace(/[^\d,]/g, '').replace(',', '.') ?? '0'
      );
      setVehicleData({
        modelo: fetchedVehicleData.Modelo ?? '',
        combustivel: fetchedVehicleData.Combustivel ?? '',
        ano: fetchedVehicleData.AnoModelo?.toString() ?? '',
        codigoFipe: fetchedVehicleData.CodigoFipe ?? '',
        valor: fetchedVehicleData.Valor ?? '',
        valorFormatado: fetchedVehicleData.Valor ?? '',
        valorNumerico,
        referencia: fetchedVehicleData.MesReferencia ?? '',
        marca: fetchedVehicleData.Marca ?? '',
      });
      return;
    }

    // Fallback para os parâmetros da URL na montagem inicial
    const urlParams = {
      modelo: searchParams.get('modelo'),
      valorFormatado: searchParams.get('valorFormatado'),
      combustivel: searchParams.get('combustivel'),
      ano: searchParams.get('ano'),
      codigoFipe: searchParams.get('codigoFipe'),
      referencia: searchParams.get('referencia'),
      marca: searchParams.get('marca'),
    };
    
    if (urlParams.modelo && urlParams.valorFormatado) {
      const valorNumerico = parseFloat(
        urlParams.valorFormatado.replace(/[^\d,]/g, '').replace(',', '.')
      ) || 0;
      setVehicleData({
        modelo: urlParams.modelo,
        combustivel: urlParams.combustivel ?? '',
        ano: urlParams.ano ?? '',
        codigoFipe: urlParams.codigoFipe ?? '',
        valor: urlParams.valorFormatado,
        valorFormatado: urlParams.valorFormatado,
        valorNumerico,
        referencia: urlParams.referencia ?? '',
        marca: urlParams.marca ?? '',
      });
    }
  }, [searchParams, fetchedVehicleData]);

  return {
    vehicleData,
    isLoadingPrice,
    setSelectedVehicleData,
    initialVehicleSelection,
  };
};
