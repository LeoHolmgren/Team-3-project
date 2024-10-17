'use client';

import Image from 'next/image'; // Import the Image component
import logoLight from '@/app/public/logo-light.png'; // Import the light mode logo
import logoDark from '@/app/public/logo-dark.png'; // Import the dark mode logo
import React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAppContext } from './appContext';
import SubscribeDialog from '@/components/subscribe-dialog';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Header({ zone }: { zone: string | undefined }) {

  const { resetAppState } = useAppContext();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <header className={"flex items-center justify-between bg-transparent " + (true ? "p-4" : "py-4")}>
      <div onClick={resetAppState} className="cursor-pointer">
        <Image
          src={logoLight}
          alt="Company Logo"
          width={392}
          height={198}
          className="block h-[3em] w-auto p-[0.4em] dark:hidden"
        />
        <Image
          src={logoDark}
          alt="Company Logo"
          width={392}
          height={198}
          className="hidden h-[3em] w-auto p-[0.4em] dark:block"
        />
      </div>

      <div className="flex items-center space-x-4">
        <SubscribeDialog zone={zone} />
        <ThemeToggle />
      </div>
    </header>
  );
}
