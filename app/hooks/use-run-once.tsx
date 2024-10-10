import { useRef, useLayoutEffect } from 'react';

export function useRunOnce(fn: () => void) {
  const triggered = useRef<boolean>(false);
  useLayoutEffect(() => {
    if (!triggered.current) {
      fn();
      triggered.current = true;
    }
  });
}
