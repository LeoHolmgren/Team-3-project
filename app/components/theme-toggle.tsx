'use client';

import * as React from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        onClick={() => setTheme('light')}
        variant="outline"
        size="icon"
        className="hidden aspect-square h-[2.25rem] justify-center text-[1.2em] leading-[1] text-[hsl(var(--text))] dark:flex"
      >
        <LuSun />
      </Button>
      <Button
        onClick={() => setTheme('dark')}
        variant="outline"
        size="icon"
        className="flex aspect-square h-[2.25rem] justify-center text-[1.2em] leading-[1] text-[hsl(var(--text))] dark:hidden"
      >
        <LuMoon />
      </Button>
    </>
  );
}
