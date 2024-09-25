"use client"

import React, { useEffect, useState } from 'react';
import { Status } from '@/components/region-select';

export default function Footer({ selectedZone }: { selectedZone: Status }) {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Update the timestamp whenever the component mounts or selectedZone changes
    const updateTimestamp = () => {
      const currentTimestamp = new Date().toLocaleString();
      setTimestamp(currentTimestamp);
    };

    updateTimestamp(); // Run on mount and when selectedZone changes
  }, [selectedZone]); // Dependency on selectedZone

  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>Made with ❤️ by Team #3</p>
      <p>Refreshed: {timestamp}</p>
    </div>
  );
}
