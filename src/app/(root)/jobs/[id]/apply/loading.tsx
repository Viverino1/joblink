import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ApplicationLoadingSkeleton() {
  return (
    <div className="flex min-h-svh flex-col items-center overflow-auto mt-12 bg-background">
      <div className="flex w-full max-w-md flex-col gap-6 my-auto">
        <Card className="relative">
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border bg-foreground/5 p-4 h-[58px] flex items-center ">
              <Skeleton className="h-4 w-1/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-3 w-1/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-3 w-1/3" />
            </div>

            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
