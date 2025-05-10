"use client";

import { WorkoutInfoCard } from "./WorkoutInfoCard";
import { Workout } from "@/app/server/get-workouts-data";
import { toastMessage } from "@/lib/utils";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Exercise } from "@/app/server/get-exercises-data";
import { WorkoutListForDialog } from "./WorkoutListForDialog";


interface WorkoutInfoListProps {
    workouts: Workout[];
}

async function fetchExerciseDetails(exercises: { id: string }[]): Promise<Exercise[]> {
    const exercisePromises = exercises.map(async (exercise) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${exercise.id}`);
        if (!response.ok) {
            console.error(`Erro ao buscar exercício ${exercise.id}`);
            return null;
        }
        return response.json();
    });
    const results = await Promise.all(exercisePromises);
    return results.filter((result): result is Exercise => result !== null);
}

export function WorkoutInfoList({ workouts }: WorkoutInfoListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [enrichedWorkout, setEnrichedWorkout] = useState<Workout | null>(null);
    const [loadingExercises, setLoadingExercises] = useState(false);

    const handleSelectWorkout = async (id: string) => {
        setLoadingExercises(true);

        try {
            const workout = workouts.find((w) => w.id === id);
            if (!workout) return;

            const allExercises = workout.subWorkouts.flatMap((sub) => sub.exercises);
            const exerciseDetails = await fetchExerciseDetails(allExercises);

            const enriched = {
                ...workout,
                subWorkouts: workout.subWorkouts.map((subWorkout) => ({
                    ...subWorkout,
                    exercises: subWorkout.exercises.map((exercise) => {
                        const details = exerciseDetails.find((d) => d.id === exercise.id);
                        return {
                            ...exercise,
                            name: details?.name,
                            category: details?.category,
                            description: details?.description,
                            videoUrl: details?.videoUrl,
                        };
                    }),
                })),
            };

            setEnrichedWorkout(enriched);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Erro ao buscar detalhes dos exercícios:", error);
            toastMessage({
                message: "Erro ao carregar detalhes do treino!",
                type: "error",
            });
        } finally {
            setLoadingExercises(false);
        }
    };


    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {workouts.map((workout) => (
                    <WorkoutInfoCard
                        key={workout.id}
                        workout={workout}
                        onSelect={handleSelectWorkout}
                    />
                ))}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Veja os detalhes abaixo:</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {loadingExercises ? (
                            <p>Carregando detalhes do treino...</p>
                        ) : enrichedWorkout ? (
                            <WorkoutListForDialog
                                workout={enrichedWorkout}
                            />
                        ) : (
                            <p>Erro ao carregar detalhes do treino.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}