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
    <header
      style={{ transition: 'all 0.2s' }}
      className={'flex items-center justify-between bg-transparent ' + (isDesktop ? 'px-8 py-4' : 'p-4')}
    >
      <div onClick={resetAppState} className="h-[2.2em] cursor-pointer">
        <Image
          src={logoLight}
          alt="Company Logo"
          width={392}
          height={198}
          className="block h-full w-auto dark:hidden"
        />
        <Image src={logoDark} alt="Company Logo" width={392} height={198} className="hidden h-full w-auto dark:block" />
      </div>

      <div className="flex items-center space-x-4">
        <SubscribeDialog zone={zone} />
        <ThemeToggle />
      </div>
    </header>
  );
}
