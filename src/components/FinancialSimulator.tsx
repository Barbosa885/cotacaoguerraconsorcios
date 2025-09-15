"use client";

import { useState } from "react";

interface FinancialSimulatorProps {
  baseValue: string; // O valor base para o cálculo (pode ser o da FIPE ou o sugerido)
}

export const FinancialSimulator = ({ baseValue }: FinancialSimulatorProps) => {
  const [downPayment, setDownPayment] = useState(0);
  const [term, setTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const formattedBaseValue = parseFloat(baseValue.replace(/\D/g, '')) / 100;
  
  // Calcular a parcela mensal
  const calculateMonthlyPayment = () => {
    if (downPayment >= formattedBaseValue) {
      setMonthlyPayment(0);
      return;
    }
    const financedAmount = formattedBaseValue - downPayment;
    const interestRate = 0.01; // Exemplo: 1% de juros ao mês
    
    // Fórmula de juros simples
    const monthlyPaymentResult = (financedAmount / term) * (1 + interestRate);
    setMonthlyPayment(monthlyPaymentResult);
  };

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Simulador de Financiamento</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Valor de Entrada (R$)</label>
          <input 
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prazo (meses)</label>
          <select 
            onChange={(e) => setTerm(parseInt(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="48">48 meses</option>
            <option value="60">60 meses</option>
          </select>
        </div>
        <button 
          onClick={calculateMonthlyPayment}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Simular
        </button>
      </div>
      {monthlyPayment > 0 && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">Parcela Mensal Estimada:</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
};
