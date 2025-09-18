'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Badge } from '~/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { 
  Car, 
  Calculator, 
  DollarSign, 
  Calendar,
  Fuel,
  Hash,
  Gauge,
  CheckCircle,
  ArrowRight,
  Info,
  Sparkles,
  Loader2
} from 'lucide-react';
import { VehicleSearch, type VehicleType } from '~/components/VehicleSearch';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { FinancingContactForm } from '~/components/FinancingContactForm';
import { Skeleton } from '~/components/ui/skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

type VehicleData = {
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

type SelectedVehicleDataType = {
  modelCode: string;
  yearCode: string;
  brandCode: string;
  vehicleType: VehicleType;
} | null;

const EvaluationLoading = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-24 w-full mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

const VehicleEvaluationContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const [vehicleData, setVehicleData] = useState<VehicleData>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<SelectedVehicleDataType>(null);

  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState([36]);
  const [optionals, setOptionals] = useState({
    multimedia: true,
    sunroof: false,
    rearCamera: false,
    leather: false,
    navigation: false
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: fetchedVehicleData, isLoading: isLoadingPrice } = api.fipe.getPrice.useQuery(
    selectedVehicleData,
    { enabled: !!selectedVehicleData }
  );

  const createListing = api.listing.create.useMutation({
    onSuccess: (data) => {
      toast.success("Seu veículo foi anunciado com sucesso!", {
        action: {
          label: "Ver anúncio",
          onClick: () => router.push(`/classificados/${data.id}`),
        },
      });
    },
    onError: (error) => {
      console.error("Erro inesperado: ", error.message);
      toast.error("Erro ao anunciar veículo", {
        description: "Um erro inesperado aconteceu, tente novamente mais tarde"
      });
    },
  });

  useEffect(() => {
    const urlParams = {
      modelo: searchParams.get('modelo'),
      valor: searchParams.get('valor'),
      valorFormatado: searchParams.get('valorFormatado'),
      combustivel: searchParams.get('combustivel'),
      ano: searchParams.get('ano'),
      codigoFipe: searchParams.get('codigoFipe'),
      referencia: searchParams.get('referencia'),
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

  const conditions = [
    { id: 'excellent', label: 'Excelente', multiplier: 1.1 },
    { id: 'good', label: 'Bom', multiplier: 1.0 },
    { id: 'fair', label: 'Regular', multiplier: 0.9 },
    { id: 'poor', label: 'Precisa de reparos', multiplier: 0.8 }
  ];

  const mileageOptions = [
    { value: '10000', label: '<= 10.000 km', multiplier: 1.05 },
    { value: '30000', label: '10.000 - 30.000 km', multiplier: 1.0 },
    { value: '50000', label: '30.000 - 50.000 km', multiplier: 0.95 },
    { value: '100000', label: '50.000 - 100.000 km', multiplier: 0.85 },
    { value: '150000', label: '>= 100.000 km', multiplier: 0.75 }
  ];

  const calculateEstimatedValue = () => {
    if (!vehicleData?.valorNumerico) return 0;
    const baseValue = vehicleData.valorNumerico;
    const conditionMultiplier = conditions.find(c => c.id === condition)?.multiplier ?? 1;
    const mileageMultiplier = mileageOptions.find(m => m.value === mileage)?.multiplier ?? 1;
    const optionalBonus = Object.values(optionals).filter(Boolean).length * 1000;
    return Math.round(baseValue * conditionMultiplier * mileageMultiplier + optionalBonus);
  };

  const calculateMonthlyPayment = () => {
    const vehiclePrice = vehicleData?.valorNumerico ?? 0;
    const downPaymentValue = parseFloat(downPayment.replace(/\D/g, '')) ?? 0;
    const loanAmount = vehiclePrice - downPaymentValue;
    const months = loanTerm[0] ?? 0;
    const interestRate = 0.015;
    if (loanAmount <= 0 || months <= 0) return 0;
    const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);
    return Math.round(monthlyPayment);
  };

  const handleAnnounceVehicle = () => {
    if (!vehicleData || !condition || !mileage || status !== 'authenticated') return;

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
    });
  };

  const hasVehicleData = vehicleData?.modelo && vehicleData.valorNumerico > 0;
  const estimatedValue = calculateEstimatedValue();
  const monthlyPayment = calculateMonthlyPayment();
  const canAnnounce = !!condition && !!mileage && status === 'authenticated';

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-26">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Avalie seu Veículo e Simule Financiamento</h1>
            <p className="text-lg text-gray-600">Descubra o valor do seu veículo e simule as melhores condições de financiamento</p>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center"><Car className="mr-2 h-5 w-5" />Selecione o Veículo</CardTitle><p className="text-sm text-gray-600">Escolha o tipo, marca, modelo e ano do veículo para começar</p></CardHeader>
            <CardContent>
              <VehicleSearch onVehicleSelected={setSelectedVehicleData} />
              {isLoadingPrice && <div className="mt-4"><Alert><Info className="h-4 w-4" /><AlertDescription>Carregando informações do veículo...</AlertDescription></Alert></div>}
            </CardContent>
          </Card>

          {hasVehicleData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-200">
                <CardHeader><CardTitle className="text-2xl font-bold text-gray-800">Avalie seu Veículo</CardTitle><p className="text-sm text-gray-600">Descubra a cotação estimada do seu veículo baseado no tempo de uso e o valor atual da FIPE</p></CardHeader>
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
                    <Select value={mileage} onValueChange={setMileage}><SelectTrigger className="mt-2 w-full bg-white"><SelectValue placeholder="Selecione uma opção..."/></SelectTrigger><SelectContent>{mileageOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Condição</Label>
                    <div className="grid grid-cols-2 gap-2">{conditions.map(c => <Button key={c.id} variant={condition === c.id ? 'default' : 'outline'} onClick={() => setCondition(c.id)} className={cn("text-sm", condition === c.id && c.id === 'good' && 'bg-yellow-500', condition === c.id && c.id === 'excellent' && 'bg-green-500', condition === c.id && c.id === 'fair' && 'bg-orange-500', condition === c.id && c.id === 'poor' && 'bg-red-500', condition === c.id && 'text-white')}>{c.label}</Button>)}</div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Opcionais</Label>
                    <div className="space-y-2">{Object.entries(optionals).map(([key, checked]) => <div key={key} className="flex items-center space-x-2"><Checkbox id={key} checked={checked} onCheckedChange={v => setOptionals(p => ({ ...p, [key]: !!v }))} className="bg-white" /><Label htmlFor={key} className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</Label></div>)}</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg text-center border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-2 flex items-center justify-center"><Calculator className="mr-2 h-4 w-4" />Preço estimado</p>
                    <p className="text-3xl font-bold text-green-600">R$ {estimatedValue.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-gray-500 mt-1">Baseado na tabela FIPE e condições informadas</p>
                  </div>

                  {status === 'authenticated' ? (
                    <Tooltip> 
                      <TooltipTrigger asChild>
                        <Button 
                        onClick={handleAnnounceVehicle} 
                        className={`w-full bg-green-500 text-white hover:bg-green-700 ${!canAnnounce || createListing.isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                        {createListing.isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        {createListing.isLoading ? 'Anunciando...' : 'Anuncie seu veículo'}
                        </Button>
                      </TooltipTrigger>
                      {(!canAnnounce || createListing.isLoading) && (
                      <TooltipContent>
                        <p> Preencha todos os campos antes.</p>
                      </TooltipContent>
                      )}
                  </Tooltip>
                  ) : (
                    <Button onClick={() => router.push('/login')} className="w-full bg-gray-400 cursor-not-allowed">
                      Faça login para anunciar
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gray-200">
                  <CardHeader><CardTitle className="text-2xl font-bold text-gray-800 flex items-center"><DollarSign className="mr-2 h-5 w-5" />Valor do Veículo</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Preço oficial FIPE:</p>
                    <p className="text-sm text-gray-700 mb-2">{vehicleData.modelo}</p>
                    <div className="bg-white p-4 rounded-lg border-2 border-blue-200"><p className="text-3xl font-bold text-blue-600">{vehicleData.valorFormatado}</p></div>
                    {vehicleData.referencia && <p className="text-xs text-gray-500">Referência: {vehicleData.referencia}</p>}
                  </CardContent>
                </Card>

                <Card className="bg-gray-200">
                  <CardHeader><CardTitle className="text-2xl font-bold text-gray-800 flex items-center"><Calculator className="mr-2 h-5 w-5" />Financiamento</CardTitle><p className="text-sm text-gray-600">Escolha um valor de entrada e um número de parcelas para ter o valor estimado por mês</p></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Entrada (R$)</Label>
                      <Input type="text" value={downPayment} onChange={e => setDownPayment(e.target.value.replace(/\D/g, ''))} placeholder="R$15.000,00" className="mt-2 bg-white" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-3"><Label className="text-base font-medium">Parcelamento (prazo)</Label><Badge variant="outline">{loanTerm[0]} meses</Badge></div>
                      <Slider value={loanTerm} onValueChange={setLoanTerm} max={60} min={12} step={6} className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1"><span>12 meses</span><span>60 meses</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center border-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-2 flex items-center justify-center"><DollarSign className="mr-2 h-4 w-4" />Valor estimado mensal da parcela</p>
                      <p className="text-3xl font-bold text-blue-600">R$ {monthlyPayment.toLocaleString('pt-BR') === "NaN" ? "0" : monthlyPayment.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500 mt-1">Taxa estimada: 1,5% a.m. | Total: R$ {(monthlyPayment * (loanTerm[0] ?? 0)).toLocaleString('pt-BR')}</p>
                    </div>
                    <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}><DialogTrigger asChild><Button className="w-full bg-black text-white hover:bg-gray-800"><CheckCircle className="mr-2 h-4 w-4" />Seja pré-aprovado</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><FinancingContactForm /></DialogContent></Dialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!hasVehicleData && <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center"><Sparkles className="h-12 w-12 text-gray-400 mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">Comece selecionando um veículo</h3><p className="text-gray-500 mb-4 max-w-sm">Use o formulário acima para escolher o veículo que deseja avaliar.</p></div>}
        </div>
      </div>
  );
};

const VehicleEvaluationPage = () => {
  return (
    <Suspense fallback={<EvaluationLoading />}>
      <VehicleEvaluationContent />
    </Suspense >
  )
}

export default VehicleEvaluationPage;
