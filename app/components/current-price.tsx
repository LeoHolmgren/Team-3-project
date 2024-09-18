import { Skeleton } from './ui/skeleton';

export default function CurrentPrice({ isPending, value }: { isPending: boolean; value: number }) {
  return (
    <div className="flex items-center gap-6">
      {isPending ? (
        <Skeleton className="h-[120px] w-[320px]" />
      ) : (
        <h1 className="inline-block h-[120px] bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-center text-9xl font-bold text-transparent">
          {new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format(value)}
        </h1>
      )}
      <div className="text-2xl">kWh</div>
    </div>
  );
}
