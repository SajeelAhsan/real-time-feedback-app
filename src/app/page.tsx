'use client'
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import {CardHeader} from "@/components/ui/card"


const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Real Time Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Real Time Feedback App - Where your identity remains secret.
        </p>
      </section>
      <Carousel 
          plugins={[Autoplay({delay: 5000})]}
          className="w-full max-w-xl">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader className="items-center text-2xl " >{message.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold">{message.content}</span>
                    <span className="text-lg font-semibold">{message.recieved}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6" >
    © 2025 Real Time Feedback. All rights reserved.
    </footer>
    </>
  );
};

export default Home;
