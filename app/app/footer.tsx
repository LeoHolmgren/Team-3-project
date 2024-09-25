"use client";
import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const currentTimestamp = new Date().toLocaleString();
    setTimestamp(currentTimestamp);
  }, []);

  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>Made with ❤️ by Team #3</p>
      <p>Refreshed: {timestamp}</p>
    </div>
  );
}
