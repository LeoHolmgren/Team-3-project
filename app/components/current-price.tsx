import { Skeleton } from './ui/skeleton';

export default function CurrentPrice({ isPending, value }: { isPending: boolean; value: number }) {
  return (
    <div>
      {isPending ? (
        <Skeleton className="h-[120px] w-[250px]" />
      ) : (
        <h1 className="h-[120px] text-center text-9xl font-bold">{value}</h1>
      )}
    </div>
  );
}
