'use client';

import Image from 'next/image'; // Import the Image component
import logoLight from '@/app/public/logo-light.png'; // Import the light mode logo
import logoDark from '@/app/public/logo-dark.png'; // Import the dark mode logo
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';
import { Button } from '../components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

// Function to handle logo click
// interface HeaderProps {
//   onClickLogo?: () => void; 
// }

export default function Header() {
  const { resetAppState } = useAppContext();
  
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center p-4 bg-transparent">
      <div onClick={onClickLogo ? onClickLogo : () => {}} className="cursor-pointer">
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
        <Button className="w-9 px-0" variant="outline" asChild>
          <Link href="https://github.com/LeoHolmgren/Team-3-project" target="_blank" rel="noreferrer">
            <GitHubLogoIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
