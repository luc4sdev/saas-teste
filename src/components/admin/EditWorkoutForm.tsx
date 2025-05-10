"use client"
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toastMessage } from '@/lib/utils';
import { Workout } from '@/app/server/get-workouts-data';
import { updateWorkout } from '@/app/actions/update-workout';
import { useRouter } from 'next/navigation';
import { ExerciseDialog } from './ExercisesDialog';
import { Exercise } from '@/app/server/get-exercises-data';

const enumDifficulty = z.enum(["beginner", "intermediate1", "advanced"]);
const enumGoal = z.enum(["hypertrophy", "weightLoss", "mobility", "correction", "strengthening"]);
const enumWeeklyFrequency = z.enum(["2x", "3x", "5x+"]);
const enumWorkoutType = z.enum(['male', 'female', 'general'])
const enumCategory = z.enum(['general', 'chest', 'arms', 'shoulders', 'back', 'lower', 'quadriceps', 'glutes', 'hamstrings', 'mobility', 'correction', 'strengthening'])

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    workoutType: enumWorkoutType,
    difficulty: enumDifficulty,
    goal: enumGoal,
    category: enumCategory,
    weeklyFrequency: enumWeeklyFrequency,
    subWorkouts: z.array(
        z.object({
            name: z.string().min(1, "Nome do subtreino é obrigatório"),
            exercises: z.array(
                z.object({
                    id: z.string().min(1, "ID do exercício é obrigatório"),
                    sets: z.number().min(1, "Número de séries é obrigatório"),
                    repetitions: z.number().min(1, "Número de repetições é obrigatório"),
                    restTime: z.number().min(1, "Tempo de descanso é obrigatório"),
                })
            ),
        })
    ),
});

type FormData = z.infer<typeof formSchema>;

interface EditWorkoutFormProps {
    workout: Workout;
    exercises: Exercise[];
    setIsEditModalOpen: (editModalOpen: boolean) => void;
}

export function EditWorkoutForm({ workout, exercises, setIsEditModalOpen }: EditWorkoutFormProps) {
    const router = useRouter();
    const { register, handleSubmit, setValue, getValues, reset, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: workout.name,
            workoutType: workout.workoutType,
            difficulty: workout.difficulty,
            goal: workout.goal,
            category: workout.category,
            weeklyFrequency: workout.weeklyFrequency,
            subWorkouts: workout.subWorkouts
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "subWorkouts",
    });

    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSubWorkoutIndex, setSelectedSubWorkoutIndex] = useState<number | null>(null);

    const generateSubWorkouts = (frequency: string) => {
        const numberOfWorkouts = frequency === "5x+" ? 7 : parseInt(frequency);
        const newSubWorkouts = Array.from({ length: numberOfWorkouts }, (_, index) => ({
            name: `Dia ${index + 1}`,
            exercises: [],
        }));
        return newSubWorkouts;
    };

    const handleWeeklyFrequencyChange = (value: string) => {
        setValue("weeklyFrequency", value as z.infer<typeof enumWeeklyFrequency>);
        const newSubWorkouts = generateSubWorkouts(value);
        remove();
        newSubWorkouts.forEach((subWorkout) => append(subWorkout));
    };


    async function onSubmit(data: FormData) {
        setLoading(true);

        try {
            const updatedWorkout = await updateWorkout(workout.id, {
                name: data.name,
                workoutType: data.workoutType,
                difficulty: data.difficulty,
                goal: data.goal,
                category: data.category,
                weeklyFrequency: data.weeklyFrequency,
                subWorkouts: data.subWorkouts
            });
            if (updatedWorkout) {
                toastMessage({
                    message: 'Treino atualizado com sucesso!',
                    type: 'success'
                })
                reset();
                setIsEditModalOpen(false)
                router.refresh();
            }

        } catch (error) {
            console.error("Erro ao atualizar treino:", error);
        } finally {
            setLoading(false);
        }
    };


    const openExerciseDialog = (index: number) => {
        setSelectedSubWorkoutIndex(index);
        setIsDialogOpen(true);
    };

    const handleAddExercises = (newExercises: { id: string; sets: number; repetitions: number; restTime: number; }[]) => {
        if (selectedSubWorkoutIndex !== null) {
            update(selectedSubWorkoutIndex, {
                ...fields[selectedSubWorkoutIndex],
                exercises: newExercises,
            });
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 shadow-md rounded-lg">
                <div>
                    <Label htmlFor="name" className="font-bold">
                        Nome do Treino
                    </Label>
                    <Input {...register("name")} className="mt-1 w-full" disabled={loading} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor='workoutType' className="font-bold">Tipo do treino</Label>
                    <Select onValueChange={(value) => setValue("workoutType", value as z.infer<typeof enumWorkoutType>)} defaultValue={getValues("workoutType")}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecione o tipo do treino" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="general">Geral</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.workoutType && <p className="text-red-500 text-sm">{errors.workoutType.message}</p>}
                </div>

                <div>
                    <Label htmlFor="difficulty" className="font-bold">
                        Dificuldade
                    </Label>
                    <Select onValueChange={(value) => setValue("difficulty", value as z.infer<typeof enumDifficulty>)} defaultValue={getValues("difficulty")}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecione a dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate1">Intermediário 1</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty.message}</p>}
                </div>

                <div>
                    <Label htmlFor="goal" className="font-bold">
                        Objetivo
                    </Label>
                    <Select onValueChange={(value) => setValue("goal", value as z.infer<typeof enumGoal>)} defaultValue={getValues("goal")}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                            <SelectItem value="weightLoss">Perda de Peso</SelectItem>
                            <SelectItem value="mobility">Mobilidade</SelectItem>
                            <SelectItem value="correction">Correção Postural</SelectItem>
                            <SelectItem value="strengthening">Fortalecimento</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}
                </div>

                <div>
                    <Label htmlFor='category' className="font-bold">Categoria</Label>
                    <Select onValueChange={(value) => setValue("category", value as z.infer<typeof enumCategory>)} value={getValues("category")}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectItem value="chest">Peito</SelectItem>
                            <SelectItem value="arms">Braços</SelectItem>
                            <SelectItem value="shoulders">Ombros</SelectItem>
                            <SelectItem value="back">Costas</SelectItem>
                            <SelectItem value="lower">Inferiores</SelectItem>
                            <SelectItem value="quadriceps">Quadríceps</SelectItem>
                            <SelectItem value="glutes">Glúteos</SelectItem>
                            <SelectItem value="hamstrings">Posteriores</SelectItem>
                            <SelectItem value="mobility">Mobilidade</SelectItem>
                            <SelectItem value="correction">Correção Postural</SelectItem>
                            <SelectItem value="strengthening">Fortalecimento</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                <div>
                    <Label htmlFor="weeklyFrequency" className="font-bold">
                        Frequência Semanal
                    </Label>
                    <Select onValueChange={handleWeeklyFrequencyChange} defaultValue={getValues("weeklyFrequency")}>
                        <SelectTrigger className="mt-1 w-full">
                            <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2x">2x</SelectItem>
                            <SelectItem value="3x">3x</SelectItem>
                            <SelectItem value="5x+">5x+</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.weeklyFrequency && <p className="text-red-500 text-sm">{errors.weeklyFrequency.message}</p>}
                </div>
                <div className="grid grid-cols-4 mt-2 gap-2">
                    {fields.map((subWorkout, subWorkoutIndex) => (

                        <div key={subWorkout.id} className="space-y-4 border p-4 rounded-lg">
                            <h2 className="font-bold">{subWorkout.name}</h2>

                            {subWorkout.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="space-y-2">
                                    <Label className="mr-2">{exerciseIndex + 1}:</Label>
                                    <Label>{exercises.find(externalExercise => externalExercise.id === exercise.id)?.name}</Label>
                                </div>
                            ))}

                            <Button type="button" onClick={() => openExerciseDialog(subWorkoutIndex)}>
                                Adicionar Exercícios
                            </Button>
                        </div>

                    ))}
                </div>
                <Button type="submit" className="mt-5 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : "Enviar"}
                </Button>
            </form>

            {isDialogOpen && selectedSubWorkoutIndex !== null && (
                <ExerciseDialog
                    isOpen={isDialogOpen}
                    exercises={exercises}
                    selectedExercises={getValues(`subWorkouts.${selectedSubWorkoutIndex}.exercises`)}
                    setIsDialogOpen={setIsDialogOpen}
                    onAddExercises={handleAddExercises}
                />
            )}
        </>
    );
};
