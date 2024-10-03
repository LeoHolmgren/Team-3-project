'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export default function SubscribeDialog() {
  const isMounted = useMounted();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the email to your backend
    console.log(values);
    setIsSubmitted(true);
  }

  if (!isMounted) return <Button>Subscribe</Button>;

  return (
    <Dialog /*onOpenChange={() => setIsSubmitted(false)}*/>
      <DialogTrigger>
        <Button>Subscribe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSubmitted ? 'Thank You!' : 'Subscribe to Price Alerts'}</DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? 'You`ve successfully subscribed to our notifications.'
              : 'Get notified when electricity prices are low.'}
          </DialogDescription>
        </DialogHeader>
        {!isSubmitted && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormDescription>We&apos;ll use this email to send you price alerts.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
