"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Workout } from "@/app/server/get-workouts-data";
import { translateCategory, translateDifficulty, translateWorkoutType } from "@/lib/utils";

interface WorkoutrDialogProps {
    isOpen: boolean;
    workouts: Workout[];
    selectedWorkoutId?: string;
    setIsDialogOpen: (open: boolean) => void;
    onSelectWorkout: (workoutId: string) => void;
}

export function WorkoutsDialog({
    isOpen,
    workouts,
    selectedWorkoutId,
    setIsDialogOpen,
    onSelectWorkout,
}: WorkoutrDialogProps) {
    const [selectedId, setSelectedId] = useState<string | undefined>(selectedWorkoutId);

    const handleConfirm = () => {
        if (selectedId) {
            onSelectWorkout(selectedId);
        }
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Selecionar Treino</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <RadioGroup
                        value={selectedId}
                        onValueChange={setSelectedId}
                        className="space-y-3 max-h-[60vh] overflow-y-auto"
                    >
                        {workouts.map((workout) => (
                            <div key={workout.id} className="flex items-center gap-2">
                                <RadioGroupItem value={workout.id} id={workout.id} />
                                <Label htmlFor={workout.id} className="flex-1">
                                    {workout.name} ({translateWorkoutType(workout.workoutType)}, {translateDifficulty(workout.difficulty)}, {workout.category !== 'general' ? translateCategory(workout.category) : 'Geral'})
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full mt-4"
                        disabled={!selectedId}
                    >
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}