import Image from 'next/image'; // Import the Image component
import logoLight from '@/app/public/logo-light.png'; // Import the light mode logo
import logoDark from '@/app/public/logo-dark.png'; // Import the dark mode logo
import { GitHubLogoIcon } from '@radix-ui/react-icons';

import Link from 'next/link';
import React from 'react';
import { Button } from '../components/ui/button';
<<<<<<< HEAD
<<<<<<< HEAD
import Image from 'next/image'; // Import the Image component
import logoLight from './logo-light.png'; // Import the light mode logo
import logoDark from './logo-dark.png';   // Import the dark mode logo
=======
import { ModeToggle } from '@/components/mode-toggle';
>>>>>>> d20fd90975157caaf4bd2d1e11d3019d115ecf49
=======
import { ModeToggle } from '@/components/mode-toggle';
>>>>>>> c858252fb3d7c58d080eaf13fe2511e466126959

export default function Header() {
  return (
    <div className="relative z-50 flex items-center justify-between py-8">
      <div className="flex items-center space-x-4">
        <Link href="/">
<<<<<<< HEAD
<<<<<<< HEAD
          {/* Replace text with logos */}
          {/* Light mode logo */}
          <Image
            src={logoLight}
            alt="Company Logo"
            width={200}
            height={200}
            className="block dark:hidden"
          />
          {/* Dark mode logo */}
          <Image
            src={logoDark}
            alt="Company Logo"
            width={200}
            height={200}
            className="hidden dark:block"
=======
=======
>>>>>>> c858252fb3d7c58d080eaf13fe2511e466126959
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
<<<<<<< HEAD
>>>>>>> d20fd90975157caaf4bd2d1e11d3019d115ecf49
=======
>>>>>>> c858252fb3d7c58d080eaf13fe2511e466126959
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button className="w-9 px-0" variant="outline" asChild>
          <Link
            href="https://github.com/LeoHolmgren/Team-3-project"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubLogoIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}