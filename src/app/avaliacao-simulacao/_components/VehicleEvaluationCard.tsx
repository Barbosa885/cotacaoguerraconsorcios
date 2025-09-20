'use client';

// Hooks
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { VehicleData } from '../_hooks/useVehicleData';

// Icones
import { Car, Gauge, Calculator, CheckCircle, Loader2 } from 'lucide-react';

// Componentes
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import { toast } from 'sonner';

import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';

const conditions = [
  { id: 'excellent', label: 'Excelente', multiplier: 1.0 },
  { id: 'good', label: 'Bom', multiplier: 0.9 },
  { id: 'fair', label: 'Regular', multiplier: 0.8 },
  { id: 'poor', label: 'Precisa de reparos', multiplier: 0.7 }
];

const mileageOptions = [
  { value: '10000', label: '<= 10.000 km', multiplier: 1.0 },
  { value: '30000', label: '10.000 - 30.000 km', multiplier: 0.95 },
  { value: '50000', label: '30.000 - 50.000 km', multiplier: 0.9 },
  { value: '100000', label: '50.000 - 100.000 km', multiplier: 0.85 },
  { value: '150000', label: '>= 100.000 km', multiplier: 0.75 }
];

const optionalLabels: Record<string, string> = {
  multimedia: 'Central Multimídia',
  sunroof: 'Teto Solar',
  rearCamera: 'Câmera de Ré',
  leather: 'Bancos de Couro',
  navigation: 'Navegador GPS'
};

interface VehicleEvaluationCardProps {
  vehicleData: VehicleData;
}

export const VehicleEvaluationCard = ({ vehicleData }: VehicleEvaluationCardProps) => {
  const router = useRouter();
  const { status } = useSession();

  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [optionals, setOptionals] = useState({
    multimedia: true,
    sunroof: false,
    rearCamera: false,
    leather: false,
    navigation: false
  });
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createListing = api.listing.create.useMutation({
    onSuccess: (data) => {
      toast.success("Seu veículo foi anunciado com sucesso!", {
        action: {
          label: "Ver anúncio",
          onClick: () => router.push(`/classificados/${data.id}`),
        },
      });
      setIsModalOpen(false);
      setDescription("");
    },
    onError: (error) => {
      console.error("Erro inesperado: ", error.message);
      toast.error("Erro ao anunciar veículo", {
        description: "Um erro inesperado aconteceu, tente novamente mais tarde"
      });
    },
  });

  const calculateEstimatedValue = () => {
    const baseValue = vehicleData?.valorNumerico ?? 0;

    if (baseValue === 0) return 0;

    const conditionMultiplier = conditions.find(c => c.id === condition)?.multiplier ?? 1;
    const mileageMultiplier = mileageOptions.find(m => m.value === mileage)?.multiplier ?? 1;
    const optionalBonus = Object.values(optionals).filter(Boolean).length * 1000;
    const calculatedValue = Math.round(baseValue * conditionMultiplier * mileageMultiplier + optionalBonus);

    return Math.min(calculatedValue, baseValue);
  };

  const estimatedValue = calculateEstimatedValue();
  const canAnnounce = !!condition && !!mileage && status === 'authenticated';

  const handleAnnounceVehicle = () => {
    if (!vehicleData || !canAnnounce) return;
    setIsModalOpen(true);
  };

  const handleConfirmAnnounce = () => {
    if (!vehicleData || !canAnnounce) return;

    createListing.mutate({
      modelName: vehicleData.modelo,
      brandName: vehicleData.marca,
      year: vehicleData.ano,
      fuelType: vehicleData.combustivel,
      fipeCode: vehicleData.codigoFipe,
      price: estimatedValue,
      mileage,
      condition,
      optionals,
      description,
    });
  };

  if (!vehicleData) return null;

  return (
    <Card className="bg-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Avalie seu Veículo</CardTitle>
        <p className="text-sm text-gray-600">Descubra a cotação estimada do seu veículo baseado nas condições condições do veículo e tempo de uso</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center"><Car className="mr-2 h-4 w-4" />Informações do veículo</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div><strong>Modelo: </strong>{vehicleData.modelo}</div>
            <div><strong>Combustível: </strong>{vehicleData.combustivel}</div>
            <div><strong>Ano: </strong>{vehicleData.ano}</div>
            <div><strong>Código FIPE: </strong>{vehicleData.codigoFipe}</div>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium flex items-center"><Gauge className="mr-2 h-4 w-4" />Selecione a Quilometragem (km)</Label>
          <Select value={mileage} onValueChange={setMileage}>
            <SelectTrigger className="mt-2 w-full bg-white"><SelectValue placeholder="Selecione uma opção..."/></SelectTrigger>
            <SelectContent>{mileageOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Condição</Label>
          <div className="grid grid-cols-2 gap-2">
            {conditions.map(c => (
              <Button 
                key={c.id} 
                variant={condition === c.id ? 'default' : 'outline'} 
                onClick={() => setCondition(c.id)} 
                className={cn(
                  "text-sm", 
                  condition === c.id && c.id === 'good' && 'bg-yellow-500',
                  condition === c.id && c.id === 'excellent' && 'bg-green-500',
                  condition === c.id && c.id === 'fair' && 'bg-orange-500',
                  condition === c.id && c.id === 'poor' && 'bg-red-500',
                  condition === c.id && 'text-white'
                )}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Opcionais</Label>
          <div className="space-y-2">
            {Object.keys(optionals).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox 
                  id={key} 
                  checked={optionals[key as keyof typeof optionals]} 
                  onCheckedChange={v => setOptionals(p => ({ ...p, [key]: !!v }))} 
                  className="bg-white" 
                />
                <Label htmlFor={key} className="text-sm">{optionalLabels[key]}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg text-center border-2 border-green-200">
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-center"><Calculator className="mr-2 h-4 w-4" />Preço estimado</p>
          <p className="text-3xl font-bold text-green-600">R$ {estimatedValue.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-gray-500 mt-1">Baseado na tabela FIPE e condições informadas</p>
        </div>

        {status === 'authenticated' ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}> 
            <Tooltip> 
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleAnnounceVehicle} 
                    disabled={!canAnnounce || createListing.isPending}
                    className="w-full bg-green-500 text-white hover:bg-green-700"
                  >
                    {createListing.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {createListing.isPending ? 'Anunciando...' : 'Anuncie seu veículo'}
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              {!canAnnounce && (
                <div className="flex flex-col justify-center align-center text-center">
                <p className="font-medium text-sm text-gray-500"> *Preencha os campos de condição e quilometragem para anunciar.</p>
                  <TooltipContent>
                    <p>Preencha os campos de condição e quilometragem para anunciar.</p>
                  </TooltipContent>
                </div>
              )}
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Detalhes do Anúncio</DialogTitle>
                <DialogDescription>
                  Adicione uma descrição detalhada para o seu veículo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  id="description"
                  placeholder="Ex: Carro de único dono, todas as revisões em dia, nunca batido..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3 h-32"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleConfirmAnnounce} 
                  disabled={createListing.isPending}
                  className="text-white hover:bg-green-700 bg-green-500"
                >
                  {createListing.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {'Confirmar e Anunciar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button onClick={() => router.push('/login')} className="w-full">
            Faça login para anunciar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
