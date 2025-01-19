import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoadingListings() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      <Tabs defaultValue="market" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="market">Marketplace</TabsTrigger>
          <TabsTrigger value="trades">Trade Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className="absolute top-3 right-3 z-10">
                  <Skeleton className="h-5 w-32" />
                </div>

                <div className="p-3">
                  <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                </div>

                <div className="p-4 pt-2 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-9 w-28" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Skeleton className="h-5 w-32" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="space-y-2">
                              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Skeleton className="h-5 w-32" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="space-y-2">
                              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
