import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';
import { Button } from '../components/ui/button';
import Image from 'next/image';  // Import the Image component
import logo from './logo.png';  // Import the logo image (adjust the path as necessary)

export default function Header() {
  return (
    <div className="relative z-50 flex items-center justify-between py-8">
      <div className="flex items-center space-x-4">
        <Link href="/">
          {/* Replace text with logo */}
          <Image src={logo} alt="Company Logo" width={200} height={200} />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* <ModeToggle /> */}
        <Button className="w-9 px-0" variant="outline" asChild>
          <Link href="https://github.com/LeoHolmgren/Team-3-project" target="_blank" rel="noreferrer">
            <GitHubLogoIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}