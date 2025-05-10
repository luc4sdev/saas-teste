import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ClickFlow | Termos de Uso",
};


export default function TermsOfUse() {
    return (
        <div className="min-h-screen  text-white p-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <h1 className="text-3xl font-bold text-center">Termos de Uso</h1>
                    <p className="text-sm text-zinc-400 text-center">Atualizado em: 22 de março de 2025</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold">1. Concordância com as Condições</h2>
                        <p className="text-sm text-zinc-300">
                            Ao utilizar nosso aplicativo de treinos, você aceita seguir estes Termos de Uso. Se não estiver de acordo com algum ponto aqui descrito, pedimos que não faça uso da plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Sobre o Aplicativo</h2>
                        <p className="text-sm text-zinc-300">
                            Nosso aplicativo oferece treinos personalizados adaptados ao seu perfil (como idade, peso, objetivos e frequência). Após criar uma conta, você recebe um treino inicial, que será atualizado periodicamente com base no seu progresso. A assinatura mensal dá acesso a todas as funcionalidades, incluindo vídeos explicativos dos exercícios e suporte contínuo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. Registro e Proteção da Conta</h2>
                        <p className="text-sm text-zinc-300">
                            Para começar, você deve registrar uma conta com informações verdadeiras, como email e dados pessoais. A segurança da sua conta é sua responsabilidade, e recomendamos proteger suas credenciais contra uso não autorizado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Proteção de Dados</h2>
                        <p className="text-sm text-zinc-300">
                            Valorizamos sua confiança e usamos seus dados apenas para oferecer uma experiência personalizada, conforme detalhado na nossa Política de Proteção de Dados. Eles não são vendidos ou compartilhados, exceto para processar pagamentos ou cumprir obrigações legais.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Responsabilidade pelo Conteúdo</h2>
                        <p className="text-sm text-zinc-300">
                            Você é o único responsável pelas informações que adiciona ao app, como dados de perfil e preferências de treino. Não nos responsabilizamos por conteúdos inadequados ou ilícitos inseridos por você.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Assinatura e Pagamentos</h2>
                        <p className="text-sm text-zinc-300">
                            A assinatura é processada via Stripe. Após o pagamento, você terá acesso total ao app, incluindo vídeos e atualizações de treino. Após a assinatura de um dos planos você tem o prazo de 7 dias para fazer o cancelamento sem custo. O reembolso será feito no prazo de 15 dias úteis após o cancelamento. Corrido o período de 7 dias o valor não será reembolsado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Mudanças no Serviço</h2>
                        <p className="text-sm text-zinc-300">
                            Buscamos manter o app funcional e disponível durante sua assinatura. Podemos, porém, alterar ou encerrar o serviço em casos excepcionais (como problemas técnicos ou legais), avisando você com antecedência sempre que possível. Não nos responsabilizamos por perdas nessas situações, mas tentaremos oferecer alternativas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Limites de Responsabilidade</h2>
                        <p className="text-sm text-zinc-300">
                            Não nos responsabilizamos por danos indiretos ou especiais decorrentes do uso ou interrupção do aplicativo, seja por falhas técnicas ou outras razões.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">9. Revisões nestas Condições</h2>
                        <p className="text-sm text-zinc-300">
                            Estas Condições de Uso podem ser revisadas ocasionalmente. A data de atualização no topo será alterada, e sugerimos que você as consulte regularmente para estar ciente de mudanças.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">10. Fale Conosco</h2>
                        <p className="text-sm text-zinc-300">
                            Para perguntas ou esclarecimentos sobre estas Condições de Uso, envie um email para: admgfit@gmail.com, ou envie uma mensagem para o WhatsApp: 62992894923.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}