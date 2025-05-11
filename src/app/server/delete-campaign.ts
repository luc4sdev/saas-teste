'use server'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

export async function deleteCampaign(id: string, logoUrl?: string, imageUrl?: string) {
    const session = await auth()
    if (!session?.user) return { error: 'Usuário não autenticado' }

    try {
        const bucket = storage
        const filesToDelete: string[] = []

        const extractPathFromUrl = (url: string) => {
            try {
                const path = decodeURIComponent(url)
                    .replace('https://storage.googleapis.com/', '')
                    .replace(/^[^/]+\//, '')
                    .split('?')[0]
                return path
            } catch (error) {
                console.error('Erro ao extrair caminho da URL:', error)
                return null
            }
        }

        if (logoUrl) {
            const path = extractPathFromUrl(logoUrl)
            if (path) {
                filesToDelete.push(path)
            }
        }

        if (imageUrl) {
            const path = extractPathFromUrl(imageUrl)
            if (path) {
                filesToDelete.push(path)
            }
        }

        await Promise.all(
            filesToDelete.map(async (filePath) => {
                try {
                    const file = bucket.file(filePath)
                    await file.delete()
                    console.log(`Arquivo ${filePath} deletado com sucesso`)
                } catch (error) {
                    console.error(`Erro ao deletar arquivo ${filePath}:`, error)
                }
            })
        )

        await db.collection('campaigns').doc(id).delete()

        return { success: true }
    } catch (err) {
        console.error('Erro ao excluir campanha:', err)
        return { error: 'Erro ao excluir campanha' }
    }
}