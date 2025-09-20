import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingListingDetail() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto p-4 pt-8 max-w-4xl min-h-screen">
      <div className="h-96 min-w-full bg-gray-200 rounded-lg flex items-center justify-center mb-8">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="md:col-span-2">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          
          <div className="flex flex-wrap gap-2 mb-6">
            <BadgeSkeleton />
            <BadgeSkeleton />
            <BadgeSkeleton />
          </div>

          <div className="prose max-w-none space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Coluna Lateral */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="border-t pt-4 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full mt-4 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const BadgeSkeleton = () => (
  <Skeleton className="h-6 w-24 rounded-full" />
);
