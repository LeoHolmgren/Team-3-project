'use client';

export default function Footer({ timestamp }: { timestamp: Date | null }) {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>Made with ❤️ by Team #3</p>
      {timestamp ? <p>Refreshed: {timestamp.toLocaleString()}</p> : <p>Waiting for zone input</p>}
    </div>
  );
}
