import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Get the current date and time when the component is loaded
    const currentTimestamp = new Date().toLocaleString();
    setTimestamp(currentTimestamp);
  }, []); // Empty array ensures this runs only when the component mounts (initial load)

  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      <p>Made with ❤️ by Team #3</p>
      <p>Page loaded on: {timestamp}</p>
    </div>
  );
}
