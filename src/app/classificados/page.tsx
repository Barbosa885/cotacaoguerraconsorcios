import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { EmptyState } from "~/components/EmptyState";

const conditionMap = {
  'excellent': 'Excelente',
  'good': 'Bom',
  'fair': 'Regular',
  'poor': 'Precisa de reparos',
};

export default async function ClassifiedsPage() {
  const listings = await api.listing.list();

  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-gray-200 flex flex-col justify-center items-center min-h-screen pt-24 sm:pt-24 md:pt-24 lg:pt-0 xl:pt-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Veículos Anunciados</h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">Encontre as melhores ofertas diretamente com os proprietários</p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <EmptyState text="Nenhum veículo anunciado no momento" subText="Parece que nossa garagem ainda está vazia! Que tal dar uma conferida mais tarde?" />
        </div>
      ) : (
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/classificados/${listing.id}`} className="block h-full">
              <Card className="flex h-full flex-col justify-between rounded-lg border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div>
                  <CardHeader className="mb-4 p-0">
                    <CardTitle className="text-xl font-bold text-gray-900">{listing.modelName}</CardTitle>
                    <p className="text-sm text-gray-500">{listing.brandName} - {listing.year}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="mb-4 text-2xl font-bold text-blue-700">R$ {listing.price.toLocaleString('pt-BR')}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{listing.mileage} km</Badge>
                      <Badge variant="secondary">{conditionMap[listing.condition as keyof typeof conditionMap] ?? listing.condition}</Badge>
                    </div>
                  </CardContent>
                </div>
                <div className="mt-6 flex items-center space-x-3 border-t pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                    {listing.seller.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-700">Anunciado por <span className="font-medium">{listing.seller.name}</span></p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
