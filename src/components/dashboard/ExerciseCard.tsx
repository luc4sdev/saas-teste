"use client";

import { Card, CardHeader, CardContent } from '../ui/card';
import { ExerciseVideo } from './ExerciseVideo';
import { translateCategory } from '@/lib/utils';
import { CheckCircle, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { Exercise } from '@/app/server/get-workouts-data';
import { useState } from 'react';

interface ExerciseCardProps {
    exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="group">
            <Card
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={toggleExpand}
            >
                <CardHeader className="p-4 bg-zinc-800/50 border-b border-zinc-700 flex flex-row justify-between items-center">
                    <h3 className="text-base font-bold text-white tracking-tight">
                        <Dumbbell className="size-4 inline mr-2 align-middle" /> {exercise.name}
                    </h3>
                    <div>
                        {isExpanded ? (
                            <ChevronUp className="size-5 text-zinc-400" />
                        ) : (
                            <ChevronDown className="size-5 text-zinc-400" />
                        )}
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent className="p-6 flex flex-col gap-6">
                        <div className="space-y-3">
                            <p className="text-sm text-zinc-400">
                                <CheckCircle className='inline mr-2 size-4' /> Categoria: <span className="font-semibold text-zinc-100">{exercise.category && translateCategory(exercise.category)}</span>
                            </p>
                            <p className="text-sm text-zinc-400">
                                <CheckCircle className='inline mr-2 size-4' /> Séries: <span className="font-semibold text-zinc-100">{exercise.sets}</span>
                            </p>
                            <p className="text-sm text-zinc-400">
                                <CheckCircle className='inline mr-2 size-4' /> Repetições: <span className="font-semibold text-zinc-100">{exercise.repetitions}</span>
                            </p>
                            <p className="text-sm text-zinc-400">
                                <CheckCircle className='inline mr-2 size-4' /> Descanso: <span className="font-semibold text-zinc-100">{exercise.restTime}s</span>
                            </p>
                            {exercise.description && (
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    <CheckCircle className='inline mr-2 size-4' /> Descrição: <span className="font-semibold text-zinc-100">{exercise.description}</span>
                                </p>
                            )}
                        </div>

                        <div className="w-full flex justify-center items-center">
                            {exercise.videoUrl && (<ExerciseVideo videoUrl={exercise.videoUrl} />)}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};