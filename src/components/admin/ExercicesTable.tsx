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
import { Exercise } from "@/app/server/get-exercises-data";
import { deleteExercise } from "@/app/actions/delete-exercise";
import { toastMessage, translateCategory } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EditExerciseForm } from "./EditExerciseForm";

interface ExercisesTableProps {
    exercises: Exercise[];
}

export function ExercisesTable({ exercises }: ExercisesTableProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);

    const handleDeleteExercise = async (id: string) => {
        const result = await deleteExercise(id);
        if (result) {
            toastMessage({
                message: "Exercício deletado com sucesso!",
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
                        <TableHead>Categoria</TableHead>
                        <TableHead>URL do Vídeo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exercises.map((exercise) => (
                        <TableRow key={exercise.id}>
                            <TableCell>{exercise.name}</TableCell>
                            <TableCell>{translateCategory(exercise.category)}</TableCell>
                            <TableCell>
                                <a
                                    href={exercise.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Assistir
                                </a>
                            </TableCell>
                            <TableCell>{exercise.description}</TableCell>
                            <TableCell className="flex gap-5">
                                {/* Modal de Editar */}
                                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingExercise(exercise);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Exercício</DialogTitle>
                                        </DialogHeader>
                                        {editingExercise && (
                                            <EditExerciseForm
                                                exercise={editingExercise}
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
                                                setExerciseToDelete(exercise); // Define o exercício a ser deletado
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Deletar Exercício "{exerciseToDelete?.name}"?
                                            </DialogTitle>
                                        </DialogHeader>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (exerciseToDelete) {
                                                    handleDeleteExercise(exerciseToDelete.id);
                                                    setIsDeleteModalOpen(false);
                                                    setExerciseToDelete(null);
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