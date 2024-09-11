import type { Metadata } from 'next';
import HomeComponent from './home';

export const metadata: Metadata = {
  title: 'OnOff',
  description: 'Detect electricity price live.',
};

export default function Home() {
  return <HomeComponent />;
}
