import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function Faq() {
    return (
        <section className="my-56 text-center px-6">
            <h2 className="text-4xl font-extrabold mb-6">Perguntas Frequentes (FAQ)</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                Aqui estão algumas das dúvidas mais comuns. Se precisar de mais informações, entre em contato!
            </p>

            <div className="max-w-5xl mx-auto space-y-4">
                <Accordion type="multiple" className="space-y-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold bg-gray-800 p-4 rounded-md hover:bg-gray-700">
                            Como funciona os treinos?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-lg bg-gray-700 rounded-md">
                            Você irá preencher um questionário e de acordo com suas respostas seu treino é montado e direcionado para você no mesmo momento. O treino é feito de acordo com suas necessidades e objetivos.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold bg-gray-800 p-4 rounded-md hover:bg-gray-700">
                            Os treinos são apenas para academia?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-lg bg-gray-700 rounded-md">
                            Sim, os treinos são feitos para pessoas que treinam em máquinas e pesos usados em academias.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold bg-gray-800 p-4 rounded-md hover:bg-gray-700">
                            Posso acessar meu treino em qualquer lugar?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-lg bg-gray-700 rounded-md">
                            Sim, o GFit é 100% online. Você pode acessar seus treinos de qualquer lugar que tenha acesso a internet, seja no celular ou no computador.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-xl font-semibold bg-gray-800 p-4 rounded-md hover:bg-gray-700">
                            Como funciona o pagamento?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-lg bg-gray-700 rounded-md">
                            O pagamento é feito através do cartão de crédito por meio da assinatura de um dos planos: Mensal, Trimestral ou Semestral, é fácil e sem burocracia.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-xl font-semibold bg-gray-800 p-4 rounded-md hover:bg-gray-700">
                            Como funciona o cancelamento da assinatura?
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-lg bg-gray-700 rounded-md">
                            O cancelamento pode ser feito a qualquer momento, diretamente no site na aba de <span className="font-extrabold">"Configurações"</span>. Após a assinatura de um dos planos você tem o prazo de 7 dias para fazer o cancelamento sem custo. O reembolso será feito no prazo de 15 dias úteis após o cancelamento. Corrido o período de 7 dias o valor <span className="font-extrabold">"Não"</span> será reembolsado.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </section>
    );
}
