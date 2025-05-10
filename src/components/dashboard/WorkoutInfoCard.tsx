"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Workout } from "@/app/server/get-workouts-data";
import { translateDifficulty, translateGoal, translateWorkoutType } from "@/lib/utils";
import { Button } from "../ui/button";

interface WorkoutInfoCardProps {
    workout: Workout;
    onSelect: (id: string) => void;
    isSelected?: boolean;
}

export function WorkoutInfoCard({ workout, onSelect }: WorkoutInfoCardProps) {

    const handleSelect = () => {
        onSelect(workout.id);
    };

    return (
        <div className="group">
            <Card className='bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden'>
                <CardHeader className="p-0 relative">
                    <div className="relative h-40 overflow-hidden">
                        <Image
                            src='/workout-banner.svg'
                            alt={workout.name}
                            layout="fill"
                            objectFit="cover"
                            className="transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white drop-shadow-md">{workout.name}</h2>
                        <div className="mt-2 space-y-2">
                            <p className="text-sm text-zinc-300 drop-shadow-md">
                                Tipo: <span className="font-semibold">{translateWorkoutType(workout.workoutType)}</span>
                            </p>
                            <p className="text-sm text-zinc-300 drop-shadow-md">
                                Dificuldade: <span className="font-semibold">{translateDifficulty(workout.difficulty)}</span>
                            </p>
                            <p className="text-sm text-zinc-300 drop-shadow-md">
                                Objetivo: <span className="font-semibold">{translateGoal(workout.goal)}</span>
                            </p>
                            <p className="text-sm text-zinc-300 drop-shadow-md">
                                Frequência semanal: <span className="font-semibold">{workout.weeklyFrequency}</span>
                            </p>
                        </div>
                        <Button
                            onClick={handleSelect}
                            className='mt-4 w-full ${isSelected ? "bg-primary'
                        >
                            Ver Treino
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}