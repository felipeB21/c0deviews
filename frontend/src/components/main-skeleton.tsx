import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function MainSkeleton() {
  const skeletons = Array.from({ length: 10 }, (_, index) => index);

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index}>
          <div className="py-6 px-2 flex gap-10">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <div className="flex flex-col gap-3 ml-2">
              <Skeleton className="h-4 w-[690px]" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </>
  );
}
