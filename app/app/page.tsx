'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { CardWithForm } from './Card';

export default function Home() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/repos/TanStack/query');

      return await response.json();
    },
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-7xl font-bold">{data.subscribers_count}</h1>
    </div>
  );
}
