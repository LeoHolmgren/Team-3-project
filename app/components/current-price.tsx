import { Skeleton } from './ui/skeleton';

export default function CurrentPrice({ isPending, value }: { isPending: boolean; value: number }) {
  return (
    <div style={{alignItems: "baseline"}} className="flex items-center gap-0">
      {isPending ? (
        <Skeleton className="h-[120px] w-[320px]" />
      ) : (
        <h1 className="inline-block bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-center text-7xl font-bold text-transparent sm:text-8xl md:text-9xl">
          {new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format(value)}
        </h1>
      )}
      <p className="text-2xl">kWh</p>
    </div>
  );
}
