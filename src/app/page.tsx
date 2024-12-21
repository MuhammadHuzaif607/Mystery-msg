'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import messages from '@/messages.json';
const Page = () => {
  return (
    <div className="container mx-auto py-5">
      <section className="py-16">
        <h1 className="text-center text-3xl font-bold ">
          Send Anonymous Message to Anyone
        </h1>
        <p className="text-center text-md font-medium">
          Dive into the world of Anonymous Creation
        </p>
      </section>
      <Carousel
        className="w-full max-w-xs mx-auto"
        opts={{
          loop: true,
        }}
        // plugins={[
        //   Autoplay({
        //     delay: 2000,
        //   }),
        // ]}
      >
        <CarouselContent>
          {messages.map((item, index) => {
            return (
              <CarouselItem key={index}>
                <div className='flex flex-col gap-y-3 px-2 border-2 rounded-md items-center py-8 '>
                  <div >
                    Message from{' '}
                    <span className="font-semibold text-decoration-line">
                      {item.receivedBy}
                    </span>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-center">
                      {item.content}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Page;
