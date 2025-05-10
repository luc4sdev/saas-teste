"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toastMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Exercise } from "@/app/server/get-exercises-data";
import { ExerciseDialog } from "./ExercisesDialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { createWorkout } from "@/app/actions/create-workout";

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

export type EnumWorkoutType = z.infer<typeof enumWorkoutType>;
export type EnumDifficulty = z.infer<typeof enumDifficulty>;
export type EnumGoal = z.infer<typeof enumGoal>;
export type EnumCategory = z.infer<typeof enumCategory>;
export type EnumWeeklyFrequency = z.infer<typeof enumWeeklyFrequency>;
export type WorkoutFormData = z.infer<typeof formSchema>;

interface CreateWorkoutFormProps {
    exercises: Exercise[];
}

export function CreateWorkoutForm({ exercises }: CreateWorkoutFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        control,
        formState: { errors },
    } = useForm<WorkoutFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subWorkouts: [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "subWorkouts",
    });

    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogCreateWorkoutOpen, setIsDialogCreateWorkoutOpen] = useState(false);
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

    const onSubmit = async (data: WorkoutFormData) => {
        setLoading(true);
        try {
            const workout = await createWorkout(data);
            if (workout) {
                toastMessage({
                    message: "Treino criado com sucesso!",
                    type: "success",
                });
                reset()
                router.refresh();
            }

        } catch (error) {
            console.error("Erro ao criar treino:", error);
        } finally {
            setLoading(false);
            setIsDialogCreateWorkoutOpen(false);
        }
    };

    const openExerciseDialog = (index: number) => {
        setSelectedSubWorkoutIndex(index);
        setIsDialogOpen(true);
    };

    const handleAddExercises = (newExercises: { id: string; sets: number; repetitions: number, restTime: number }[]) => {
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
            <Button
                onClick={() => setIsDialogCreateWorkoutOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Criar Treino
            </Button>
            <Dialog open={isDialogCreateWorkoutOpen} onOpenChange={setIsDialogCreateWorkoutOpen} >
                <DialogTrigger />
                <DialogContent className="max-w-fit">
                    <DialogTitle>Crie o Treino</DialogTitle>
                    <DialogDescription>Preencha os dados para criar um novo treino.</DialogDescription>

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
                            <Select onValueChange={(value) => setValue("workoutType", value as EnumWorkoutType)} value={getValues("workoutType")}>
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
                            <Select onValueChange={(value) => setValue("difficulty", value as z.infer<typeof enumDifficulty>)}>
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
                            <Select onValueChange={(value) => setValue("goal", value as z.infer<typeof enumGoal>)}>
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
                            <Select onValueChange={(value) => setValue("category", value as EnumCategory)} value={getValues("category")}>
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
                            <Select onValueChange={handleWeeklyFrequencyChange}>
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
                                            <Label className="mr-2">Séries: {exercise.sets}</Label>
                                            <Label>Repetições: {exercise.repetitions}</Label>
                                        </div>
                                    ))}

                                    <Button type="button" onClick={() => openExerciseDialog(subWorkoutIndex)}>
                                        Adicionar Exercícios
                                    </Button>
                                </div>

                            ))}
                        </div>
                        <Button type="submit" className="mt-5 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                            ) : "Criar treino"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

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
}
