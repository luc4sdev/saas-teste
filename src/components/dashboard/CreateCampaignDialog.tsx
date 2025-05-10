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

const formSchema = z.object({
    campaignName: z.string().min(1, 'Nome da campanha é obrigatório'),
    contactName: z.string().min(1, 'Nome de contato é obrigatório'),
    whatsapp: z.string().min(8, 'Número do WhatsApp é obrigatório'),
    email: z.string().email('E-mail inválido'),
    headline: z.string().min(1, 'Título é obrigatório'),
    subheadline: z.string().optional(),
    logo: z.any().optional(),
    image: z.any().optional()
})

type CampaignFormData = z.infer<typeof formSchema>

export function CreateCampaignDialog() {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CampaignFormData>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = async (data: CampaignFormData) => {
        setLoading(true)

        try {
            await createCampaign(data)
        } catch (error) {
            console.error('Erro ao criar campanha:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
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

                    <div>
                        <Label>Logo</Label>
                        <Input type="file" {...register('logo')} disabled={loading} />
                    </div>

                    <div>
                        <Label>Imagem de Fundo</Label>
                        <Input type="file" {...register('image')} disabled={loading} />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Enviando...' : 'Criar Campanha'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
