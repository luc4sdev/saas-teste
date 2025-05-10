import { db } from "@/lib/firebase";
import { Timestamp } from "firebase-admin/firestore";

// Interface para dados do usuário (baseado no seu schema)
interface CustomerData {
    name: string;
    gender: "male" | "female"
    age: number;
    weight: number;
    goal: "hypertrophy" | "weightLoss";
    trainingTime: "0-2" | "2-6" | "6-12" | "12-17" | "17+";
    weeklyFrequency: "2x" | "3x" | "4x" | "5x+";
    muscleFocus: "general" | "chest" | "arms" | "shoulders" | "back" | "lower" | "quadriceps" | "glutes" | "hamstrings";
}

// Interface para exercícios dentro do treino
interface Exercise {
    id: string;
    name: string;
    sets: number;
    repetitions: number;
    category: "chest" | "arms" | "shoulders" | "back" | "lower" | "quadriceps" | "glutes" | "hamstrings" | "mobility" | "correction" | "strengthening";
}

// Interface para subtreinos
interface SubWorkout {
    name: string;
    exercises: Exercise[];
}

// Interface para o treino completo
interface Workout {
    id: string;
    name: string;
    workoutType: "male" | "female" | "general";
    difficulty: "beginner" | "intermediate1" | "intermediate2" | "advanced";
    goal: "hypertrophy" | "weightLoss";
    category: "general" | "chest" | "arms" | "shoulders" | "back" | "lower" | "quadriceps" | "glutes" | "hamstrings" | "mobility" | "correction" | "strengthening";
    weeklyFrequency: "2x" | "3x" | "4x" | "5x+";
    subWorkouts: SubWorkout[];
}

// Interface para pontuação do match
interface WorkoutMatchScore {
    workoutId: string;
    score: number;
    difficulty: string;
}

// Função para calcular a pontuação de compatibilidade
function calculateWorkoutMatchScore(
    customerData: CustomerData,
    workout: Workout
): number {
    let score = 0;

    if (workout.workoutType === "general" || workout.workoutType === customerData.gender) {
        score += 30; // Treinos "general" ou correspondentes ao gênero ganham pontos
    } else {
        score -= 20; // Penalidade para treinos incompatíveis com o gênero
    }

    // Match de objetivo (prioridade alta: 40 pontos)
    if (customerData.goal === workout.goal) {
        score += 40;
    }

    // Match de frequência semanal (prioridade média: 30 pontos)
    if (customerData.weeklyFrequency === workout.weeklyFrequency) {
        score += 30;
    }

    // Match de dificuldade baseado no tempo de treino (prioridade média: 20 pontos)
    const difficultyMatch: { [key: string]: string } = {
        "0-2": "beginner",
        "2-6": "intermediate1",
        "6-12": "intermediate2",
        "12-17": "intermediate2",
        "17+": "advanced"
    };
    if (difficultyMatch[customerData.trainingTime] === workout.difficulty) {
        score += 20;
    }

    // Bônus por foco muscular (prioridade baixa: 10 pontos)
    const hasMuscleFocusMatch = workout.subWorkouts.some((subWorkout) =>
        subWorkout.exercises.some((exercise) =>
            exercise.category === customerData.muscleFocus
        )
    );
    if (hasMuscleFocusMatch || customerData.muscleFocus === "general") {
        score += 20;
    }

    return score;
}


export async function generateCustomerWorkout(
    customerId: string,
    customerData: CustomerData
) {
    try {
        // 1. Buscar todos os treinos disponíveis
        const workoutsSnapshot = await db.collection("workouts").get();
        const workouts: Workout[] = workoutsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Workout, "id">)
        }));

        // 2. Calcular pontuação de cada treino
        const workoutScores: WorkoutMatchScore[] = workouts.map(workout => ({
            workoutId: workout.id,
            score: calculateWorkoutMatchScore(customerData, workout),
            difficulty: workout.difficulty
        }));

        // 3. Selecionar o melhor treino
        const bestWorkout = workoutScores.reduce((prev, current) =>
            prev.score > current.score ? prev : current
        );

        // 4. Buscar detalhes do treino selecionado
        const selectedWorkoutDoc = await db
            .collection("workouts")
            .doc(bestWorkout.workoutId)
            .get();
        if (!selectedWorkoutDoc.exists) {
            throw new Error(`Treino com ID ${bestWorkout.workoutId} não encontrado`);
        }
        const selectedWorkout = selectedWorkoutDoc.data() as Workout;

        const customerRef = db.collection("customers").doc(customerId);
        const customerDoc = await customerRef.get();
        const currentData = customerDoc.data();

        const currentWorkoutsHistory: { workoutId: string, date: number }[] = currentData?.workoutsHistory || [];
        const lastWorkoutUpdate = Timestamp.now().toMillis();
        currentWorkoutsHistory.push({ workoutId: selectedWorkout.id, date: lastWorkoutUpdate });

        await customerRef.update({
            currentWorkoutId: selectedWorkout.id,
            lastWorkoutUpdate: Timestamp.now().toMillis(),
            workoutsHistory: currentWorkoutsHistory,
        });

        console.log(`Treino ${bestWorkout.workoutId} gerado com sucesso para o usuário ${customerId}`);
        return selectedWorkout.id;

    } catch (error) {
        console.error("Erro ao gerar treino:", error);
        throw error;
    }
}