import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { EmptyState } from "~/components/EmptyState";

export default async function ClassifiedsPage() {
  const listings = await api.listing.list();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Veículos Anunciados</h1>
        <p className="text-lg text-gray-600">Encontre as melhores ofertas diretamente com os proprietários</p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <EmptyState text="Nenhum veículo anunciado no momento" subText="Parece que nossa garagem ainda está vazia! Que tal dar uma conferida mais tarde?" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/classificados/${listing.id}`} className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {/* Placeholder for image - you can add image upload functionality later */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Sem imagem</p>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{listing.modelName}</CardTitle>
                  <p className="text-sm text-gray-500">{listing.brandName} - {listing.year}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">R$ {listing.price.toLocaleString('pt-BR')}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary">{listing.mileage} km</Badge>
                      <Badge variant="secondary">{listing.condition}</Badge>
                    </div>
                  </div>
                  <div className="border-t mt-4 pt-3 flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      {listing.seller.name?.charAt(0)}
                    </div>
                    <p className="text-xs text-gray-600">Anunciado por {listing.seller.name}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
