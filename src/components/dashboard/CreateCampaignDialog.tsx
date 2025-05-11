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
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowUpFromLine } from 'lucide-react'
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
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm<CampaignFormData>({
        resolver: zodResolver(formSchema)
    })


    const onSubmit = async (data: CampaignFormData) => {
        setLoading(true)

        try {
            const imagesInput = document.getElementById(
                "imageInput"
            ) as HTMLInputElement;


            const logoInput = document.getElementById(
                "logoInput"
            ) as HTMLInputElement;

            if (!imagesInput.files?.length) return;
            if (!logoInput.files?.length) return;

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
                router.refresh();
            }
        } catch (error) {
            console.error('Erro ao criar campanha:', error)
            toastMessage({
                message: 'Erro ao criar campanha',
                type: 'error'
            })
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Selecionar</Button>
            </DialogTrigger>

            <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            </DialogContent>
        </Dialog >
    )
}