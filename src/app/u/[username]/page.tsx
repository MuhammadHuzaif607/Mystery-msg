'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

const Page = ({ params }: { params: { username: string } }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username } = params;

  // Zod implementation
  const form = useForm({
    defaultValues: {
      content: '',
    },
  });
  const { reset, setValue, watch } = form;
  const message = watch('content');

  // on submit data
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/send_message', {
        username,
        content: data.content,
      });
      if (response.data?.success) {
        toast({
          title: 'Successfully sent message',
        });
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to send message',
        description:
          axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
    reset();
  };

  const GetText = (e: any) => {
    setValue('content', e.target.innerText);
  };

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Send Anonymous Message to anyone
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 p-5 rounded-xl w-8/12 mx-auto"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center g">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  <Button type="submit">Send</Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
      <section>
        <div className="w-8/12 mx-auto px-5">
          <h2 className="text-2xl font-bold mb-5 ">
            Messages You would like to ask
          </h2>
          <div
            className="p-2 cursor-pointer border-2 rounded border-slate-500 mb-4"
            onClick={GetText}
          >
            Whats the one thing You always wanted to do but you are arfaid to?
          </div>
          <div
            className="p-2 cursor-pointer border-2 rounded border-slate-500 mb-4"
            onClick={GetText}
          >
            Whats your favourite movie?
          </div>
          <div
            className="p-2 cursor-pointer border-2 rounded border-slate-500 mb-4"
            onClick={GetText}
          >
            Whats the one thing you are scared of most?
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
