import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";

export default async function ListingDetailPage({ params }: { params: Promise<{ listingId: string }>} ) {
  const { listingId } = await params;

  const listing = await api.listing.getById({ id: listingId });

  if (!listing) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto p-4 pt-8 max-w-4xl min-h-screen">
      <div className="h-96 w-4xl bg-gray-200 rounded-lg flex items-center justify-center mb-8">
        <p className="text-gray-500">Galeria de Imagens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{listing.modelName}</h1>
          <p className="text-lg text-gray-500 mb-4">{listing.brandName} - {listing.year}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{listing.mileage} km</Badge>
            <Badge variant="secondary">Condição: {listing.condition}</Badge>
            <Badge variant="secondary">Combustível: {listing.fuelType}</Badge>
          </div>

          <div className="prose max-w-none">
            <h3 className="font-semibold">Opcionais</h3>
            <ul className="list-disc pl-5">
              {Object.entries(listing.optionals as Record<string, boolean>).map(([key, value]) => value && <li key={key}>{key}</li>)}
            </ul>
            
            <h3 className="font-semibold mt-6">Descrição</h3>
            <p>Este é um ótimo veículo, bem cuidado e com todas as revisões em dia. Entre em contato para mais detalhes.</p>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <p className="text-sm text-gray-600">Preço</p>
              <p className="text-4xl font-bold">R$ {listing.price.toLocaleString('pt-BR')}</p>
            </CardHeader>
            <CardContent>
              <div className="border-t pt-4">
                <p className="font-semibold mb-3">Vendedor</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={listing.seller.image ?? undefined} />
                    <AvatarFallback>{listing.seller.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{listing.seller.name}</p>
                    <p className="text-sm text-gray-500">Membro desde {new Date().getFullYear()}</p> {/* Placeholder */}
                  </div>
                </div>
                <Button disabled className="w-full bg-gray-400 text-white py-2 rounded-lg mt-4 hover:bg-green-700 cursor-not-allowed">Entrar em contato</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
