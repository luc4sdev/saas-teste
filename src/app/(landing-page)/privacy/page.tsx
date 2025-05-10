import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ClickFlow | Política de Privacidade",
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen text-white p-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <h1 className="text-3xl font-bold text-center">Política de Privacidade</h1>
                    <p className="text-sm text-zinc-400 text-center">Atualizado em: 22 de março de 2025</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Nosso Compromisso</h2>
                        <p className="text-sm text-zinc-300">
                            Proteger seus dados é uma prioridade para nós. Esta Política de Proteção de Dados descreve como gerenciamos suas informações pessoais ao usar nosso aplicativo de treinos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Dados que Registramos</h2>
                        <p className="text-sm text-zinc-300">
                            Ao usar o app, coletamos:
                        </p>
                        <ul className="list-disc ml-6 text-sm text-zinc-300">
                            <li><strong>Dados da Conta:</strong> Nome, email, gênero, idade, peso, objetivos, frequência de treino e preferências musculares.</li>
                            <li><strong>Treinos:</strong> Informações sobre treinos criados, subtreinos, exercícios (nome, séries, repetições) e vídeos acessados.</li>
                            <li><strong>Pagamentos:</strong> Dados processados pelo Stripe (como email) para gerenciar a assinatura.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. Finalidade do Uso</h2>
                        <p className="text-sm text-zinc-300">
                            Seus dados são utilizados para:
                        </p>
                        <ul className="list-disc ml-6 text-sm text-zinc-300">
                            <li>Gerar treinos adaptados ao seu perfil e atualizá-los com o tempo.</li>
                            <li>Processar sua assinatura e fornecer acesso a vídeos e recursos premium.</li>
                            <li>Aprimorar o aplicativo e resolver dúvidas ou problemas técnicos.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Divulgação de Dados</h2>
                        <p className="text-sm text-zinc-300">
                            Seus dados não são repassados a terceiros, salvo:
                        </p>
                        <ul className="list-disc ml-6 text-sm text-zinc-300">
                            <li>Para o Stripe, a fim de processar pagamentos.</li>
                            <li>Quando solicitado por autoridades legais ou para cumprir obrigações judiciais.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Medidas de Segurança</h2>
                        <p className="text-sm text-zinc-300">
                            Usamos tecnologias como criptografia para proteger seus dados contra acesso não autorizado. Apesar disso, não podemos garantir segurança total em transmissões online.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Período de Armazenamento</h2>
                        <p className="text-sm text-zinc-300">
                            Guardamos seus dados enquanto você usa o app ou conforme necessário por lei. Você pode pedir a remoção da sua conta a qualquer momento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Seus Controle e Opções</h2>
                        <p className="text-sm text-zinc-300">
                            Você pode revisar, editar ou solicitar a exclusão dos seus dados. Para isso, envie um pedido para admgfit@gmail.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Revisões nesta Política</h2>
                        <p className="text-sm text-zinc-300">
                            Esta Política pode ser modificada ao longo do tempo. A data no topo indicará a última revisão, e recomendamos que você a consulte frequentemente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">9. Fale Conosco</h2>
                        <p className="text-sm text-zinc-300">
                            Para esclarecimentos sobre esta Política de Proteção de Dados, envie um email para: admgfit@gmail.com, ou envie uma mensagem para o WhatsApp: 62992894923.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}