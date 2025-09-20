import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingClassifieds() {
  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-gray-200 flex flex-col justify-center items-center min-h-screen pt-24 sm:pt-24 md:pt-24 lg:pt-0 xl:pt-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Veículos Anunciados</h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">Encontre as melhores ofertas diretamente com os proprietários</p>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderiza múltiplos Skeletons para simular o layout */}
        {Array(3).fill(null).map((_, i) => (
          <Card key={i} className="flex h-full flex-col justify-between rounded-lg border bg-white p-6 shadow-sm">
            <div>
              <CardHeader className="mb-4 p-0">
                <CardTitle className="text-xl font-bold text-gray-900">
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
                <p className="text-sm text-gray-500">
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <p className="mb-4 text-2xl font-bold text-blue-700">
                  <Skeleton className="h-8 w-1/3" />
                </p>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </div>
            <div className="mt-6 flex items-center space-x-3 border-t pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <p className="text-sm text-gray-700">
                <Skeleton className="h-4 w-2/3" />
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

