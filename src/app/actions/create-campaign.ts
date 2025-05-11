'use server'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'
import { Timestamp } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'


export async function createCampaign(formData: FormData) {
    const session = await auth()
    if (!session?.user) return null

    try {
        const campaignName = formData.get('campaignName') as string
        const contactName = formData.get('contactName') as string
        const whatsapp = formData.get('whatsapp') as string
        const email = formData.get('email') as string
        const headline = formData.get('headline') as string
        const subheadline = formData.get('subheadline') as string | null
        const logo = formData.get('logo') as File
        const image = formData.get('image') as File

        const campaignRef = db.collection('campaigns').doc()
        const userId = session.user.id
        const campaignId = campaignRef.id

        const uploadFile = async (file: File, folder: string) => {
            if (!file) return null

            const extension = file.name.split('.').pop()
            const filename = `${randomUUID()}.${extension}`
            const filePath = `campaigns/${userId}/${campaignId}/${folder}/${filename}`

            const bucket = storage
            const fileRef = bucket.file(filePath)

            const buffer = Buffer.from(await file.arrayBuffer())
            await fileRef.save(buffer, {
                metadata: {
                    contentType: file.type
                }
            })

            await fileRef.makePublic()

            return fileRef.publicUrl()
        }

        const logoUrl = logo ? await uploadFile(logo, 'logo') : null
        const imageUrl = image ? await uploadFile(image, 'image') : null

        const campaignData = {
            id: campaignId,
            userId,
            campaignName,
            contactName,
            whatsapp,
            email,
            headline,
            subheadline: subheadline || '',
            logoUrl,
            imageUrl,
            createdAt: Timestamp.now().toMillis(),
        }

        await campaignRef.set(campaignData)
        return campaignData
    } catch (error) {
        console.error('Erro ao criar campanha:', error)
        return null
    }
}