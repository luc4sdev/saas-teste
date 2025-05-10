"use client";

import Image from 'next/image';
import { Card, CardHeader, CardContent } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import { Workout } from '@/app/server/get-workouts-data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { translateCategory, translateDifficulty, translateGoal, translateWorkoutType } from '@/lib/utils';

interface CustomerWorkoutHistoryCardProps {
    workout: Workout;
    date: Date;
}

export function CustomerWorkoutHistoryCard({ workout, date }: CustomerWorkoutHistoryCardProps) {

    return (
        <div className="group">
            <Card
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
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
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded">
                            <span className="text-sm text-white">
                                {format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white drop-shadow-md mb-2">{workout.name}</h2>
                        <div className='space-y-2'>
                            <p className="text-sm drop-shadow-md">
                                <CheckCircle className='size-4 inline text-emerald-500' /> Tipo: {translateWorkoutType(workout.workoutType)}
                            </p>
                            <p className="text-sm drop-shadow-md">
                                <CheckCircle className='size-4 inline text-emerald-500' /> Categoria: {workout.category !== 'general' ? translateCategory(workout.category) : 'Geral'}
                            </p>
                            <p className="text-sm drop-shadow-md">
                                <CheckCircle className='size-4 inline text-emerald-500' /> Objetivo: {translateGoal(workout.goal)}
                            </p>
                            <p className="text-sm drop-shadow-md">
                                <CheckCircle className='size-4 inline text-emerald-500' /> Dificuldade: {translateDifficulty(workout.difficulty)}
                            </p>
                            <p className="text-sm drop-shadow-md">
                                <CheckCircle className='size-4 inline text-emerald-500' /> Frequência semanal: {workout.weeklyFrequency}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};