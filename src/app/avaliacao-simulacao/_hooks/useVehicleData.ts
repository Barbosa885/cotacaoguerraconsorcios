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

  const { data: fetchedVehicleData, isLoading: isLoadingPrice } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  useEffect(() => {
    const urlParams = {
      modelo: searchParams.get('modelo'),
      valor: searchParams.get('valor'),
      valorFormatado: searchParams.get('valorFormatado'),
      combustivel: searchParams.get('combustivel'),
      ano: searchParams.get('ano'),
      codigoFipe: searchParams.get('codigoFipe'),
      referencia: searchParams.get('referencia'),
      // Marca não vem da URL, então buscamos do fetch ou deixamos vazio
      marca: fetchedVehicleData?.Marca ?? ''
    };
    
    if (urlParams.modelo && urlParams.valor) {
      const valorNumerico = parseFloat(urlParams.valor.replace('.', '')) ?? 0;
      setVehicleData({
        modelo: urlParams.modelo,
        combustivel: urlParams.combustivel ?? '',
        ano: urlParams.ano ?? '',
        codigoFipe: urlParams.codigoFipe ?? '',
        valor: urlParams.valor ?? '',
        valorFormatado: urlParams.valorFormatado ?? '',
        valorNumerico,
        referencia: urlParams.referencia ?? '',
        marca: urlParams.marca,
      });
    } else if (fetchedVehicleData) {
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
    }
  }, [searchParams, fetchedVehicleData]);

  return {
    vehicleData,
    isLoadingPrice,
    setSelectedVehicleData,
  };
};
