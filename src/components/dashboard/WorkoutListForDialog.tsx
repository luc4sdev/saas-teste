"use client"

import { Clock, Download, Signal, Target } from 'lucide-react';
import { WorkoutCard } from './WorkoutCard';
import { Workout } from '@/app/server/get-workouts-data';
import { generatePdfWorkout, translateDifficulty, translateGoal } from '@/lib/utils';
import { Separator } from '../ui/separator';

import { Button } from '../ui/button';



interface WorkoutListProps {
    workout: Workout;
    updateDate?: string;
    nextUpdateDate?: string;
}

export function WorkoutListForDialog({ workout, updateDate, nextUpdateDate }: WorkoutListProps) {
    return (
        <div className='flex flex-col gap-3'>
            <Separator />
            <div className='flex justify-between'>
                <h1 className='text-sm text-primary font-bold'>{workout.name}</h1>
                {(updateDate && nextUpdateDate) &&
                    <span className="text-xs font-bold text-zinc-400 text-center">
                        <Clock className="size-4 inline mr-1" /> {updateDate} - {nextUpdateDate}
                    </span>
                }
            </div>
            <div className='flex justify-between items-end'>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm font-bold'><Signal className='size-4 inline mr-2 text-green-500' /> {translateDifficulty(workout.difficulty)}</p>
                    <p className='text-sm font-bold'><Target className='size-4 inline mr-2 text-red-500' /> {translateGoal(workout.goal)}</p>

                </div>
                <Button variant='outline' onClick={() => generatePdfWorkout(workout)} >
                    <Download className="size-4 mr-2" /> Baixar Treino
                </Button>
            </div>
            <Separator />
            <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {workout.subWorkouts
                        .filter((subWorkout) => subWorkout.exercises.length > 0)
                        .map((subWorkout, index) => (
                            <WorkoutCard
                                key={index}
                                imageSrc="/workout-banner.svg"
                                title={subWorkout.name}
                                exercises={subWorkout.exercises}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};