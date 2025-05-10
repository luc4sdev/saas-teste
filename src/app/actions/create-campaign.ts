import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase' // Importando o storage
import { Timestamp } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const CreateCampaignSchema = z.object({
    campaignName: z.string().min(1, 'Nome da campanha é obrigatório'),
    contactName: z.string().min(1, 'Nome de contato é obrigatório'),
    whatsapp: z.string().min(8, 'Número do WhatsApp é obrigatório'),
    email: z.string().email('E-mail inválido'),
    headline: z.string().min(1, 'Título é obrigatório'),
    subheadline: z.string().optional(),
    logo: z.any().optional(),
    image: z.any().optional(),
})

export type CreateCampaignSchemaType = z.infer<typeof CreateCampaignSchema>

// Função para fazer upload do arquivo para o Firebase Storage
async function uploadFileToStorage(file: Express.Multer.File, folder: string) {
    const fileName = `${folder}/${uuidv4()}_${file.originalname}`
    const fileRef = storage.bucket().file(fileName)

    // Fazendo o upload
    await fileRef.save(file.buffer)

    // Tornar o arquivo acessível publicamente
    await fileRef.makePublic()

    // Retorna a URL pública
    return fileRef.publicUrl()
}

export async function createCampaign(formData: CreateCampaignSchemaType) {
    const session = await auth()
    if (!session?.user) return null

    try {
        const campaignRef = db.collection('campaigns').doc()
        const generatedId = randomUUID();
        const storageRef = storage.file(`campaign-images/${campaignRef.id}/${generatedId}`);
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await storageRef.save(buffer);
        const imagePath = storageRef.name;
        // Variáveis para logo e imagem (URLs)
        let logoUrl = ''
        let imageUrl = ''

        // Fazendo upload do logo, se houver
        if (logoFile) {
            logoUrl = await uploadFileToStorage(logoFile, 'campaign_logos')
        }

        // Fazendo upload da imagem, se houver
        if (imageFile) {
            imageUrl = await uploadFileToStorage(imageFile, 'campaign_images')
        }

        // Dados da campanha a serem salvos no Firestore
        const campaignData = {
            id: campaignRef.id,
            userId: session.user.id,
            campaignName: formData.campaignName,
            contactName: formData.contactName,
            whatsapp: formData.whatsapp,
            email: formData.email,
            headline: formData.headline,
            subheadline: formData.subheadline || '',
            logo: logoUrl,
            image: imageUrl,
            createdAt: Timestamp.now().toMillis(),
        }

        // Salvando a campanha no Firestore
        await campaignRef.set(campaignData)

        return campaignData
    } catch (error) {
        console.error('Erro ao criar campanha:', error)
        return null
    }
}
