import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Skeleton } from "./ui/skeleton";

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
    <Card className="w-full max-w-6xl mx-auto mt-8 border-blue-300">
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
  return (
    <Card className="w-full max-w-6xl mx-auto border-blue-300">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">{vehicleData.Modelo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p>Combustível: {vehicleData.Combustivel}</p>
            <p>Código Fipe: {vehicleData.CodigoFipe}</p>
            <p>Ano Modelo: {vehicleData.AnoModelo}</p>
            <p>Referência: {vehicleData.MesReferencia}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 font-bold">Valor:</p>
            <p className="text-4xl font-bold text-blue-700">
              {vehicleData.Valor}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { CarDetailsCard, SkeletonCarDetailsCard };
