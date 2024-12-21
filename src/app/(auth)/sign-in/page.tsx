'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import siginInSchema from '@/Schema/signInSchema';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod implementation

  const form = useForm({
    resolver: zodResolver(siginInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // on submit data

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: data.email, // Changed 'identifier' to 'email'
        password: data.password,
      });

      if (response?.ok) {
        router.replace('/dashboard');
        toast({
          title: 'Login successful',
          description: 'You have been logged in',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Login failed',
          description: response?.error || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error occurred during sign-in:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-4/12 shadow-xl  p-5 rounded-xl"
        >
          <h1 className="font-bold text-center text-xl">
            Send Anonymous Messages
          </h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormDescription>This is your public email.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormDescription>This will be your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" type="submit">
              Signin
            </Button>
            <p className="text-sm">
              Don&apos;t have an account ?{' '}
              <span>
                <Link
                  href="/sign-up"
                  className="text-emerald-700 text-decoration-line font-medium"
                >
                  Sign Up
                </Link>
              </span>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
