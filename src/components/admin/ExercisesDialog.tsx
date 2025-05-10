"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Exercise } from "@/app/server/get-exercises-data";

interface SelectedExercise {
  id: string;
  sets: number;
  repetitions: number;
  restTime: number;
}

interface ExerciseDialogProps {
  isOpen: boolean;
  exercises: Exercise[];
  selectedExercises: SelectedExercise[];
  setIsDialogOpen: (dialogOpen: boolean) => void;
  onAddExercises: (selectedExercises: SelectedExercise[]) => void;
}

export function ExerciseDialog({ isOpen, exercises, selectedExercises, onAddExercises, setIsDialogOpen }: ExerciseDialogProps) {
  const [selectedExercisesState, setSelectedExercisesState] = useState<Record<string, SelectedExercise>>({});
  const [exerciseSearch, setExerciseSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      const preSelected = selectedExercises.reduce((acc, exercise) => {
        acc[exercise.id] = exercise;
        return acc;
      }, {} as Record<string, SelectedExercise>);
      setSelectedExercisesState(preSelected);
    }
  }, [isOpen, selectedExercises]);

  const handleCheckboxChange = (exercise: Exercise) => {
    setSelectedExercisesState((prev) => {
      const newState = { ...prev };

      if (newState[exercise.id]) {
        delete newState[exercise.id];
      } else {
        newState[exercise.id] = { id: exercise.id, sets: 0, repetitions: 0, restTime: 0 };
      }

      return newState;
    });
  };

  const handleInputChange = (exerciseId: string, field: "sets" | "repetitions" | "restTime", value: number) => {
    setSelectedExercisesState((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const handleConfirm = () => {
    const formattedExercises = Object.values(selectedExercisesState);
    onAddExercises(formattedExercises);
    setIsDialogOpen(false);
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  return (
    <Dialog open={isOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Exercícios</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Selecione os Exercícios</DialogTitle>
          <Input onChange={e => setExerciseSearch(e.target.value)} placeholder="Pesquise o exercício" />
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {exercises
            .filter((exercise) =>
              normalizeText(exercise.name).includes(normalizeText(exerciseSearch))
            ).map((exercise) => (
              <div key={exercise.id} className="flex items-center gap-4 border p-2 rounded">
                <Checkbox
                  id={exercise.id}
                  checked={!!selectedExercisesState[exercise.id]}
                  onCheckedChange={() => handleCheckboxChange(exercise)}
                />
                <Label htmlFor={exercise.id} className="flex-1">
                  {exercise.name}
                </Label>
                {selectedExercisesState[exercise.id] && (
                  <div className="flex gap-2 items-center">
                    <Label>Séries</Label>
                    <Input
                      type="number"
                      placeholder="Séries"
                      value={selectedExercisesState[exercise.id].sets}
                      onChange={(e) => handleInputChange(exercise.id, "sets", Number(e.target.value))}
                      className="w-20"
                    />
                    <Label>Repetições</Label>
                    <Input
                      type="number"
                      placeholder="Repetições"
                      value={selectedExercisesState[exercise.id].repetitions}
                      onChange={(e) => handleInputChange(exercise.id, "repetitions", Number(e.target.value))}
                      className="w-20"
                    />

                    <Label>Descanso (s)</Label>
                    <Input
                      type="number"
                      placeholder="Descanso"
                      value={selectedExercisesState[exercise.id].restTime}
                      onChange={(e) => handleInputChange(exercise.id, "restTime", Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            ))}
          <Button type="button" onClick={handleConfirm} className="w-full mt-4">
            Confirmar Seleção
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
