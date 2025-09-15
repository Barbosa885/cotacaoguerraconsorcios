"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectContent 
} from "./ui/select";

interface ValuationSimulatorProps {
  fipePrice: string;
}

export const ValuationSimulator = ({ fipePrice }: ValuationSimulatorProps) => {
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState("");
  const [suggestedValue, setSuggestedValue] = useState(0);

  // Remove os caracteres de moeda e formata para um número
  const formattedFipeValue = parseFloat(fipePrice.replace(/\D/g, '')) / 100;

  const calculateSuggestedValue = () => {
    let discount = 0;

    // Desconto por quilometragem
    if (mileage === "high") {
      discount += 0.10; // 10% de desconto
    }

    // Desconto por condição
    if (condition === "average") {
      discount += 0.05; // 5% de desconto
    } else if (condition === "bad") {
      discount += 0.15; // 15% de desconto
    }

    const finalValue = formattedFipeValue * (1 - discount);
    setSuggestedValue(finalValue);
  };

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Simulador de Cotação</h3>
      <div className="space-y-4">
        <div>
          <Select 
            onValueChange={(value) => setMileage(value)} 
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a Quilometragem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa (&lt; 10.000km)</SelectItem>
              <SelectItem value="high">Alta (&gt; 50.000km)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select 
            onValueChange={(value) => setCondition(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o estado do veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perfect">Perfeito</SelectItem>
              <SelectItem value="good">Bom</SelectItem>
              <SelectItem value="average">Médio</SelectItem>
              <SelectItem value="bad">Precisa de Reparos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={calculateSuggestedValue}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Calcular Valor Sugerido
        </Button>
      </div>
      {suggestedValue > 0 && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">Valor Sugerido:</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {suggestedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
};
