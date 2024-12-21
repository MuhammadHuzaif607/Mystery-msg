'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import verifyCodeSChema from '@/Schema/verifyschema';

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { username } = useParams();

  // Zod implementation

  const form = useForm({
    resolver: zodResolver(verifyCodeSChema),
    defaultValues: {
      verifyCode: '',
    },
  });

  // on submit data

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: username,
        verifyCode: data.verifyCode,
      });

      if (response?.data.success) {
        toast({
          title: 'Verified your account',
          description: response?.data.message,
          variant: 'default',
        });
        router.replace('/sign-in'); // Redirect user to success page or another desired path
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to verify',
        description:
          axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your verification code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="outline" type="submit">
            Verify
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Page;
