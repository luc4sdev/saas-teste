import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart, PlayCircle } from "lucide-react";

const benefits = [
    {
        icon: <CheckCircle className="w-10 h-10 text-blue-500" />,
        title: "Treinos Personalizados",
        description: "Cada treino é feito exclusivamente para você, montado e adptado ao seu nível de treinamento, atualizado a cada 6 semanas de acordo com seu nível de evolução.",
    },
    {
        icon: <BarChart className="w-10 h-10 text-green-500" />,
        title: "Diferentes níveis de dificuldade",
        description: "Acesso a diferentes treinos desde o iniciante, intermediário e avançado.",
    },
    {
        icon: <PlayCircle className="w-10 h-10 text-orange-500" />,
        title: "Vídeos Explicativos",
        description: "Demonstrações em vídeo para garantir que você execute os exercícios corretamente.",
    },
];

export function HowItWorks() {
    return (
        <section className="mt-56 text-center">
            <h2 className="text-4xl font-extrabold mb-6">Como Funciona?</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                GFit analisa seu perfil e cria treinos individualizados e ajustados conforme sua necessidade.
            </p>

            <div className="grid md:grid-cols-3 gap-6 px-6">
                {benefits.map((benefit, index) => (
                    <Card key={index} className="bg-gray-800 border-none shadow-lg p-6 transform transition duration-300 hover:scale-105">
                        <CardHeader>
                            <p className="flex justify-center">{benefit.icon}</p>
                            <CardTitle className="text-xl mt-4">{benefit.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400">{benefit.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
