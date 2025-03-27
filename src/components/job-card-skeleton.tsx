import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="hover:bg-accent/5 transition-colors bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-14 w-14 rounded-md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-5 w-5 shrink-0" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Skeleton className="h-1.5 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}