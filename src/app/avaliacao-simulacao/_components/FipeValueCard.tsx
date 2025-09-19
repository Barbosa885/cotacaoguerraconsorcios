import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { DollarSign } from 'lucide-react';
import type { VehicleData } from '../_hooks/useVehicleData';

interface FipeValueCardProps {
  vehicleData: VehicleData;
}

export const FipeValueCard = ({ vehicleData }: FipeValueCardProps) => {
  if (!vehicleData) {
    return null;
  }

  return (
    <Card className="bg-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Valor do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">Preço oficial FIPE:</p>
        <p className="text-sm text-gray-700 mb-2">{vehicleData.modelo}</p>
        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
          <p className="text-3xl font-bold text-blue-600">{vehicleData.valorFormatado}</p>
        </div>
        {vehicleData.referencia && (
          <p className="text-xs text-gray-500 mt-1">Referência: {vehicleData.referencia}</p>
        )}
      </CardContent>
    </Card>
  );
};
