import { Smartphone, Clock, Gift } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const benefits = [
    {
        icon: <Smartphone className="w-8 h-8 text-blue-500" />,
        title: "Acesso 100% Online",
        description: "Treine de qualquer academia, a qualquer hora.",
    },
    {
        icon: <Clock className="w-8 h-8 text-orange-500" />,
        title: "Flexibilidade de Horário",
        description: "Treine quando quiser.",
    },
    {
        icon: <FaWhatsapp className="w-8 h-8 text-emerald-500" />,
        title: "Suporte via WhatsApp",
        description: "Suporte direto com o personal via WhatsApp.",
    },
    {
        icon: <Gift className="w-8 h-8 text-red-500" />,
        title: "Bônus",
        description: "Treinos de Fortalecimento e Mobilidade.",
    },

];

export function Benefits() {
    return (
        <section className="mt-56 text-center">
            <h2 className="text-4xl font-extrabold mb-6">Benefícios do GFit</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                Transforme seu treino com um app feito para otimizar seus resultados e manter sua motivação em alta.
            </p>

            <div className="max-w-4xl mx-auto space-y-6 px-6">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 bg-gray-800 rounded-xl shadow-md">
                        <div className="p-3 bg-gray-700 rounded-lg">{benefit.icon}</div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.description}</p>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}
