import { 
  CalendarDays, 
  Car, 
  Fuel, 
  Hash 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

interface CarDetailsCardProps {
  vehicleData: {
    Modelo: string;
    Combustivel: string;
    CodigoFipe: string;
    AnoModelo: number;
    MesReferencia?: string;
    Valor: string;
  };
}

const SkeletonCarDetailsCard = () => {
  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 border-blue-300">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">
          <Skeleton className="h-8 w-80" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="mb-1">
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="mb-1">
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="mb-1">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="mb-1">
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div>
              <Skeleton className="h-8 w-56" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CarDetailsCard = ({ vehicleData }: CarDetailsCardProps) => {
  // Função que determina a cor do badge do combustível
  const getFuelColor = (fuel: string) => {
    if (fuel.toLowerCase().includes('gasolina')) return 'bg-orange-100 text-orange-800';
    if (fuel.toLowerCase().includes('etanol')) return 'bg-green-100 text-green-800';
    if (fuel.toLowerCase().includes('diesel')) return 'bg-yellow-100 text-yellow-800';
    if (fuel.toLowerCase().includes('flex')) return 'bg-blue-100 text-blue-800';
    if (fuel.toLowerCase().includes('híbrido') || fuel.toLowerCase().includes('hibrido')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex mt-6 items-center justify-between">
          <div className="flex-1 col justify-center items-center">
            <CardTitle className="text-2xl font-bold mb-1">{vehicleData.Modelo}</CardTitle>
            <p className="flex items-center space-x-2">
              <Badge className={`${getFuelColor(vehicleData.Combustivel)}`} >
                <Fuel className="mr-1 h-4 w-4" />
                {vehicleData.Combustivel}
              </Badge>
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm font-medium">Valor FIPE</p>
            <p className="text-3xl font-bold">
              {vehicleData.Valor}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border">
            <div className="p-2 bg-blue-100 rounded-full">
              <Hash className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Código FIPE</p>
              <p className="font-semibold">{vehicleData.CodigoFipe}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border">
            <div className="p-2 bg-green-100 rounded-full">
              <Car className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ano Modelo</p>
              <p className="font-semibold">{vehicleData.AnoModelo}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border">
            <div className="p-2 bg-purple-100 rounded-full">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Referência</p>
              <p className="font-semibold">{vehicleData.MesReferencia}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>💡 Importante:</strong> Este valor é baseado na Tabela FIPE oficial e representa o preço médio de mercado. 
            O valor final pode variar conforme o estado de conservação, documentação e região.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { CarDetailsCard, SkeletonCarDetailsCard };
