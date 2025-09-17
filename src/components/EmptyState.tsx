import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-4">
      <Image src="/imgs/EmptyState.svg" alt="Empty State" width={300} height={300} className="mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">Nenhum veículo selecionado</h2>
      <p className="text-gray-500 text-center max-w-md">
        Selecione o tipo de veículo, marca, modelo e ano para consultar o valor atualizado na tabela FIPE.
      </p>
    </div>
  );
};
