'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/Schema/signupSchema';
import { ApiResponse } from '@/types/ApiResponse';
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIssubmitting] = useState(false);
  const debounce = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // Zod implementation

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkuserunique = async () => {
      if (username) {
        setIsLoading(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(
            `/api/check-username-unique/?username=${username}`
          );
          if (response?.data.success === true) {
            setUsernameMessage(response.data.message);
          }
        } catch (err) {
          const axioserror = err as AxiosError<ApiResponse>;
          setUsernameMessage(
            axioserror.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkuserunique();
  }, [username]);

  // on submit data

  const onSubmit = async (data: object) => {
    setIssubmitting(true);
    try {
      const response = await axios.post('/api/signup', data);
      if (response?.data.success === true) {
        toast({
          title: 'Successfully Signed Up',
          description: response.data.message,
        });
        router.replace(`verify/${username}`);
      }
    } catch (err) {
      const axioserror = err as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to  Signed Up',
        description: axioserror.response?.data.message,
        variant: 'destructive',
      });
    } finally {
      setIssubmitting(false);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    onChange={(e: any) => {
                      field.onChange(e);
                      debounce(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            </>
          ) : (
            ''
          )}
          <p
            className={`text-sm  ${
              usernameMessage === 'Username is unique'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {usernameMessage}
          </p>
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
                <FormMessage />
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
            <Button variant="outline" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : (
                'Signup'
              )}
            </Button>
            <p className="text-sm">
              You already have an account ?{' '}
              <span>
                <Link href="/sign-in" className="text-emerald-700 text-decoration-line font-medium">
                  Sign In
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
