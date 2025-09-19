'use client';

import { useState } from 'react';

// Componentes
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import { Badge } from '~/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { FinancingContactForm } from '~/components/FinancingContactForm';

// Icones
import { Calculator, DollarSign, CheckCircle } from 'lucide-react';

interface FinancingSimulatorCardProps {
  vehiclePrice: number;
}

export const FinancingSimulatorCard = ({ vehiclePrice }: FinancingSimulatorCardProps) => {
  const [downPayment, setDownPayment] = useState("");
  const [loanTerm, setLoanTerm] = useState([36]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const calculateMonthlyPayment = () => {
    const downPaymentValue = parseFloat(downPayment.replace(/\D/g, '')) ?? 0;
    const loanAmount = vehiclePrice - downPaymentValue;
    const months = loanTerm[0] ?? 0;
    // A taxa de juros random
    const interestRate = 0.015; 

    if (loanAmount <= 0 || months <= 0) return 0;

    const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);
    return Math.round(monthlyPayment);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * (loanTerm[0] ?? 0);

  return (
    <Card className="bg-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Financiamento
        </CardTitle>
        <p className="text-sm text-gray-600">
          Escolha um valor de entrada e um número de parcelas para ter o valor estimado por mês.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Entrada (R$)</Label>
          <Input 
            type="text" 
            value={downPayment} 
            onChange={e => setDownPayment(e.target.value.replace(/\D/g, ''))} 
            placeholder="R$ 15.000" 
            className="mt-2 bg-white" 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-base font-medium">Parcelamento (prazo)</Label>
            <Badge variant="outline">{loanTerm[0]} meses</Badge>
          </div>
          <Slider 
            value={loanTerm} 
            onValueChange={setLoanTerm} 
            max={60} 
            min={12} 
            step={6} 
            className="w-full" 
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12 meses</span>
            <span>60 meses</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg text-center border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-2 flex items-center justify-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Valor estimado mensal da parcela
          </p>
          <p className="text-3xl font-bold text-blue-600">
            R$ {isNaN(monthlyPayment) ? "0" : monthlyPayment.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Taxa estimada: 1,5% a.m. | Total: R$ {isNaN(totalPayment) ? "0" : totalPayment.toLocaleString('pt-BR')}
          </p>
        </div>
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              <CheckCircle className="mr-2 h-4 w-4" />
              Seja pré-aprovado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <FinancingContactForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
