import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from "~/components/ui/button";

export default function HomePage(){
  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-gray-300 flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="max-w-5xl lg:max-w-6xl p-8 sm:p-12 md:p-16 text-center md:text-left">
        <h1 className="text-3xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
          Pesquise preços, <span className="text-blue-700">Avalie</span> seu veículo e <span className="text-blue-700">Simule Financiamentos</span> de forma inteligente.
        </h1>
        <p className="mt-6 text-sm lg:text-lg max-w-3xl lg:max-w-4xl text-gray-600 dark:text-gray-300">
          Descubra o valor de mercado de qualquer carro e simule opções de financiamento com dados
          oficiais da Tabela FIPE. Tudo em um só lugar, de forma rápida e segura.
        </p>
        <div className="mt-8">
          <Link href="/consulta-fipe">
            <Button size="sm" className="w-full sm:w-auto px-8 py-6 text-sm lg:text-lg font-semibold bg-blue-800 text-white hover:bg-blue-600">
              Busque um carro novo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
