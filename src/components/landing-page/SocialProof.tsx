"use client";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const results = [
    {
        image: "/social-proof-1.jpeg",
        time: "3 meses de treino",
    },
    {
        image: "/social-proof-4.jpeg",
        time: "2 meses de treino",
    },
    {
        image: "/social-proof-2.jpeg",
        time: "6 meses de treino",
    },
    {
        image: "/social-proof-3.jpeg",
        time: "2 meses de treino",
    },

];

export function SocialProof() {
    return (
        <section className="mt-56 text-center px-4">
            <h2 className="text-4xl font-extrabold mb-6">Resultados Reais</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                Veja a transformação de nossos alunos em poucos meses de treino
            </p>

            <div className="max-w-full mx-auto">
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {results.map((result, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                    <Card className="bg-gray-800 border border-foreground shadow-lg overflow-hidden">
                                        <CardContent className="relative aspect-square">
                                            <div className="relative h-full w-full">
                                                <Image
                                                    src={result.image}
                                                    alt={`Resultado de ${result.time}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-y-0 left-1/2 w-1 bg-white/50"></div>
                                                <div className="absolute bottom-0 left-0 right-0 flex">
                                                    <div className="w-1/2 bg-black/70 py-2">
                                                        <p className="text-white font-bold">ANTES</p>
                                                    </div>
                                                    <div className="w-1/2 bg-black/70 py-2">
                                                        <p className="text-white font-bold">DEPOIS</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="p-4 text-center">
                                            <p className="text-gray-400">{result.time}</p>
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex left-2 bg-gray-800 hover:bg-gray-700">
                        <ChevronLeft className="h-4 w-4" />
                    </CarouselPrevious>
                    <CarouselNext className="hidden md:flex right-2 bg-gray-800 hover:bg-gray-700">
                        <ChevronRight className="h-4 w-4" />
                    </CarouselNext>
                </Carousel>
            </div>
        </section>
    );
}