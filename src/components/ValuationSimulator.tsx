"use client";

import { useState } from "react";

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
          <label className="block text-sm font-medium text-gray-700">Quilometragem</label>
          <select 
            onChange={(e) => setMileage(e.target.value)} 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Selecione a Quilometragem</option>
            <option value="low">Baixa (&lt; 10.000km)</option>
            <option value="high">Alta (&gt; 50.000km)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado do Veículo</label>
          <select 
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Selecione o Estado</option>
            <option value="perfect">Perfeito</option>
            <option value="good">Bom</option>
            <option value="average">Médio</option>
            <option value="bad">Precisa de Reparos</option>
          </select>
        </div>
        <button 
          onClick={calculateSuggestedValue}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Calcular Valor Sugerido
        </button>
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
