'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { createCampaign } from '@/app/actions/create-campaign'
import { compressFiles, handleImageInput, toastMessage, triggerImageInput } from '@/lib/utils'
import Image from 'next/image'
import { ArrowRight, ArrowUpFromLine, CheckCircle, MessageCircle } from 'lucide-react'
import { Separator } from '../ui/separator'

const formSchema = z.object({
    campaignName: z.string().min(1, 'Nome da campanha é obrigatório'),
    contactName: z.string().min(1, 'Nome de contato é obrigatório'),
    whatsapp: z.string().min(8, 'Número do WhatsApp é obrigatório'),
    email: z.string().email('E-mail inválido'),
    headline: z.string().min(1, 'Título é obrigatório'),
    subheadline: z.string().optional(),
})

type CampaignFormData = z.infer<typeof formSchema>

export function CreateCampaignDialog() {
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CampaignFormData>({
        resolver: zodResolver(formSchema)
    })

    const formValues = watch();
    const previewData = {
        ...formValues,
        logoUrl: logo,
        imageUrl: image,
        id: 'preview',
        userId: 'preview',
        createdAt: Date.now()
    };


    const onSubmit = async (data: CampaignFormData) => {
        setLoading(true)

        try {
            const imagesInput = document.getElementById(
                "imageInput"
            ) as HTMLInputElement;


            const logoInput = document.getElementById(
                "logoInput"
            ) as HTMLInputElement;

            if (!logoInput.files?.length) {
                toastMessage({
                    message: 'Selecione uma Logo',
                    type: "error"
                })
                return;
            }
            if (!imagesInput.files?.length) {
                toastMessage({
                    message: 'Selecione uma Imagem',
                    type: "error"
                })
                return;
            }

            const compressedFileLogo = await compressFiles(Array.from(logoInput.files));
            const compressedFileImage = await compressFiles(Array.from(imagesInput.files));

            const formData = new FormData();

            formData.append("logo", compressedFileLogo[0]);
            formData.append("image", compressedFileImage[0]);
            formData.append('campaignName', data.campaignName)
            formData.append('contactName', data.contactName)
            formData.append('whatsapp', data.whatsapp)
            formData.append('email', data.email)
            formData.append('headline', data.headline)
            if (data.subheadline) formData.append('subheadline', data.subheadline)

            const campaign = await createCampaign(formData)
            if (campaign) {
                toastMessage({
                    message: 'Campanha criada com sucesso!',
                    type: 'success'
                })
                reset();
                setLogo(null);
                setImage(null);
                setIsDialogOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Erro ao criar campanha:', error)
            toastMessage({
                message: 'Erro ao criar campanha',
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Selecionar</Button>
            </DialogTrigger>

            <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <div className='flex h-full'>
                    <div className='w-1/2 p-6 overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>Nova Campanha</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <div>
                                <Label>Nome da Campanha</Label>
                                <Input {...register('campaignName')} disabled={loading} />
                                {errors.campaignName && (
                                    <p className="text-red-500 text-sm">{errors.campaignName.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Nome de Contato</Label>
                                <Input {...register('contactName')} disabled={loading} />
                                {errors.contactName && (
                                    <p className="text-red-500 text-sm">{errors.contactName.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>WhatsApp</Label>
                                <Input {...register('whatsapp')} disabled={loading} />
                                {errors.whatsapp && (
                                    <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>E-mail</Label>
                                <Input {...register('email')} disabled={loading} />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Headline (Título da Landing Page)</Label>
                                <Textarea {...register('headline')} disabled={loading} />
                                {errors.headline && (
                                    <p className="text-red-500 text-sm">{errors.headline.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Subheadline (Texto leve)</Label>
                                <Textarea {...register('subheadline')} disabled={loading} />
                            </div>
                            <Separator />
                            <div className="flex flex-col items-center gap-3 text-xs">
                                <div className="w-[100px] h-[100px] rounded-xl bg-background-tertiary overflow-hidden">
                                    {logo ? (
                                        <Image
                                            src={logo}
                                            alt="Logo"
                                            width={100}
                                            height={100}
                                            className="object-cover object-center"
                                        />
                                    ) : (
                                        <Button
                                            type='button'
                                            className="w-full h-full"
                                            onClick={() => triggerImageInput("logoInput")}
                                        >
                                            100x100
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    type='button'
                                    className="text-white flex items-center gap-2"
                                    onClick={() => triggerImageInput("logoInput")}
                                >
                                    <ArrowUpFromLine className="size-4" />
                                    <span>Adicionar logo</span>
                                </Button>
                                <Input
                                    type="file"
                                    id="logoInput"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setLogo(handleImageInput(e))}
                                />
                            </div>

                            <Separator />
                            <div className="flex flex-col items-center gap-3 text-xs">
                                <div className="w-[100px] h-[100px] rounded-xl bg-background-tertiary overflow-hidden">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt="Imagem de Fundo"
                                            width={100}
                                            height={100}
                                            className="object-cover object-center"
                                        />
                                    ) : (
                                        <Button
                                            type='button'
                                            className="w-full h-full"
                                            onClick={() => triggerImageInput("imageInput")}
                                        >
                                            100x100
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    type='button'
                                    className="text-white flex items-center gap-2"
                                    onClick={() => triggerImageInput("imageInput")}
                                >
                                    <ArrowUpFromLine className="size-4" />
                                    <span>Adicionar Imagem de Fundo</span>
                                </Button>
                                <Input
                                    type="file"
                                    id="imageInput"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setImage(handleImageInput(e))}
                                />
                            </div>
                            <Separator />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Enviando...' : 'Criar Campanha'}
                            </Button>
                        </form>
                    </div>

                    <div className="w-1/2 bg-gray-50 border-l border-gray-200 overflow-y-auto">
                        <div className="p-4 sticky top-0 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-900">Pré-visualização</h3>
                            <p className="text-sm text-gray-900">
                                Visualização aproximada da landing page
                            </p>
                        </div>

                        <div className="p-4">
                            <LandingPagePreview campaign={previewData} />
                        </div>
                    </div>
                </div>


            </DialogContent>
        </Dialog >
    )
}


function LandingPagePreview({ campaign }: { campaign: any }) {
    return (
        <div className="w-full min-h-[80vh] bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-lg overflow-hidden">
            <header className="py-4 px-4">
                {campaign.logoUrl && (
                    <div className="flex justify-center">
                        <div className="relative h-10 w-32">
                            <Image
                                src={campaign.logoUrl}
                                alt="Logo da campanha"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
            </header>

            <main className="px-4 py-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-6 text-center">
                        <h1 className="text-3xl font-bold text-primary">
                            {campaign.headline || "Título da Campanha"}
                        </h1>

                        {campaign.subheadline && (
                            <p className="text-lg text-gray-600">
                                {campaign.subheadline}
                            </p>
                        )}

                        {campaign.imageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md mt-4">
                                <Image
                                    src={campaign.imageUrl}
                                    alt="Imagem da campanha"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-3 max-w-md mx-auto">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm">
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                <span className='text-gray-800'>Atendimento personalizado</span>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                <span className='text-gray-800'>Resposta rápida via WhatsApp</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="gap-2">
                                Fale conosco agora
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-4 px-4 border-t border-gray-200 mt-8 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} {campaign.campaignName || "Nome da Campanha"}. Todos os direitos reservados.
            </footer>
        </div>
    )
}