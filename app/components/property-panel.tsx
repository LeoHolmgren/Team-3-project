import { Skeleton } from './ui/skeleton';

export default function PropertyPanel({ isPending, property, label, labelClassName, value, unit, ...objs }: { isPending: boolean; value: number, property: string, label: string, labelClassName: string, unit: string }) {
  return <div style={{ flexDirection: "column", alignItems: "center" }} className="flex gap-0" {...objs} >
    
    {isPending ? (
      <>
        <Skeleton className="h-[10em] w-[18em]" />
      </>
    ) : (
      <>
        <h1 style={{ opacity: "0.85", fontSize: "1.7em", lineHeight: 1.1, fontWeight: 100 }} className="inline-block">{property}</h1>
        <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block " + labelClassName}>
          {label}
        </h2>
        <h3 style={{ opacity: "0.65", fontSize: "2em", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-1" }} className="inline-block text-center text-xl">
          {new Intl.NumberFormat('en-US', {
            maximumSignificantDigits: 3,
          }).format(value)}
          &nbsp;
          <span style={{ fontSize: "0.5em", fontWeight: 100 }}>{unit}</span>
        </h3>
      </>
    )}

  </div>

}