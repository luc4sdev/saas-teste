'use server'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

export async function deleteCampaign(id: string, logoUrl?: string, imageUrl?: string) {
    const session = await auth()
    if (!session?.user) return { error: 'Usuário não autenticado' }

    try {
        const filesToDelete: string[] = []
        if (logoUrl) {
            const logoPath = decodeURIComponent(new URL(logoUrl).pathname.split('/o/')[1])
            filesToDelete.push(logoPath)
        }
        if (imageUrl) {
            const imagePath = decodeURIComponent(new URL(imageUrl).pathname.split('/o/')[1])
            filesToDelete.push(imagePath)
        }

        await Promise.all(
            filesToDelete.map(async (path) => {
                await storage.file(path).delete().catch(() => null)
            })
        )

        await db.collection('campaigns').doc(id).delete()

        return { success: true }
    } catch (err) {
        console.error('Erro ao excluir campanha:', err)
        return { error: 'Erro ao excluir campanha' }
    }
}
