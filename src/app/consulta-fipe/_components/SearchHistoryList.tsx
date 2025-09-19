// Componentes
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

// tRPC
import { api } from "~/trpc/react";

// Componente para exibir o histórico
const SearchHistoryList = () => {
  const { data: history, isLoading } = api.searchHistory.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
        <Skeleton className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return <p className="text-center text-sm text-gray-500">Nenhuma busca recente encontrada.</p>;
  }

  return (
    <div className="mx-auto max-w-sm space-y-2">
      {history.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-lg border bg-white p-2">
          <div>
            <p className="text-sm font-semibold">{item.modelName}</p>
            <p className="text-xs text-gray-600">{item.brandName} - {item.year}</p>
          </div>
          <Badge variant="outline" className="text-blue-700">{item.price}</Badge>
        </div>
      ))}
    </div>
  );
};

export { SearchHistoryList };
