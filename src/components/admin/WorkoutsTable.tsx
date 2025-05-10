"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Workout } from "@/app/server/get-workouts-data";
import { deleteWorkout } from "@/app/actions/delete-workout";
import { toastMessage, translateCategory, translateDifficulty, translateGoal, translateWorkoutType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EditWorkoutForm } from "./EditWorkoutForm";
import { Exercise } from "@/app/server/get-exercises-data";

interface WorkoutsTableProps {
    workouts: Workout[];
    exercises: Exercise[];
}

export function WorkoutsTable({ workouts, exercises }: WorkoutsTableProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

    const handleDeleteWorkout = async (id: string) => {
        const result = await deleteWorkout(id);
        if (result) {
            toastMessage({
                message: "Treino deletado com sucesso!",
                type: "success",
            });
            router.refresh();
        }
    };

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Dificuldade</TableHead>
                        <TableHead>Objetivo</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Dias na semana</TableHead>
                        <TableHead>Exercícios</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workouts.map((workout) => (
                        <TableRow key={workout.id}>
                            <TableCell>{workout.name}</TableCell>
                            <TableCell>{translateWorkoutType(workout.workoutType)}</TableCell>
                            <TableCell>{translateDifficulty(workout.difficulty)}</TableCell>
                            <TableCell>{translateGoal(workout.goal)}</TableCell>
                            <TableCell>{workout.category !== 'general' ? translateCategory(workout.category) : 'Geral'}</TableCell>
                            <TableCell>{workout.weeklyFrequency}</TableCell>
                            <TableCell>{`${workout.subWorkouts.reduce((total, subWorkout) => total + subWorkout.exercises.length, 0)} exercícios`}</TableCell>
                            <TableCell className="flex gap-5">
                                {/* Modal de Editar */}
                                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingWorkout(workout);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-fit">
                                        <DialogHeader>
                                            <DialogTitle>Editar Treino</DialogTitle>
                                        </DialogHeader>
                                        {editingWorkout && (
                                            <EditWorkoutForm
                                                workout={editingWorkout}
                                                exercises={exercises}
                                                setIsEditModalOpen={setIsEditModalOpen}
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>

                                {/* Modal de Deletar */}
                                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setWorkoutToDelete(workout);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Deletar "{workoutToDelete?.name}"?
                                            </DialogTitle>
                                        </DialogHeader>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (workoutToDelete) {
                                                    handleDeleteWorkout(workoutToDelete.id);
                                                    setIsDeleteModalOpen(false);
                                                    setWorkoutToDelete(null);
                                                }
                                            }}
                                            className="ml-2"
                                        >
                                            Deletar
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}