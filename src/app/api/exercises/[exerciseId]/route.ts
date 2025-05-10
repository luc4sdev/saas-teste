
import { getExerciseData } from "@/app/server/get-exercises-data";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ exerciseId: string }> }) {
    const { exerciseId } = await params
    const exercise = await getExerciseData(exerciseId);
    if (!exercise) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }
    return NextResponse.json(exercise);
}