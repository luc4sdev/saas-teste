"use client"

import Image from 'next/image';
import { Card, CardHeader, CardContent } from '../ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Exercise } from '@/app/server/get-workouts-data';
import { useState } from 'react';
import { ExerciseCard } from './ExerciseCard';

interface WorkoutCardProps {
    imageSrc: string;
    title: string;
    exercises: Exercise[];
}

export function WorkoutCard({ imageSrc, title, exercises }: WorkoutCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExercises = () => {
        setIsExpanded((prev) => !prev);
    };
    return (
        <div className="group">
            <Card
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
                onClick={toggleExercises}
            >
                <CardHeader className="p-0 relative">
                    <div className="relative h-40 overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={title}
                            layout="fill"
                            objectFit="cover"
                            className="transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white drop-shadow-md">{title}</h2>
                        <p className="text-sm text-zinc-300 drop-shadow-md">{exercises.length} exercícios</p>
                    </div>
                    <div className="relative z-10">
                        {isExpanded ? (
                            <ChevronUp className="size-6 text-white hover:text-zinc-200 transition-colors" />
                        ) : (
                            <ChevronDown className="size-6 text-white hover:text-zinc-200 transition-colors" />
                        )}
                    </div>
                </CardContent>
            </Card>

            {isExpanded && (
                <div className="mt-4 grid gap-4">
                    {exercises.map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                </div>
            )}
        </div>
    );
};