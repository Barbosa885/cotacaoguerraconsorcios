import { 
  Card, 
  CardContent, 
  CardHeader, 
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const SkeletonCarDetailsCard = () => {
  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex mt-6 items-center justify-between">
          <div className="flex-1 col justify-center items-center space-y-2">
            <Skeleton className="h-8 w-3/4 bg-white/20" />
            <Skeleton className="h-6 w-24 bg-white/20" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-20 ml-auto bg-white/20" />
            <Skeleton className="h-9 w-32 ml-auto bg-white/20" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3}).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>💡 Importante:</strong> Este valor é baseado na Tabela FIPE oficial e representa o preço médio de mercado. 
            O valor final pode variar conforme o estado de conservação, documentação e região.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { SkeletonCarDetailsCard };
