import { db } from "@/lib/firebase"

export type CampaignData = {
    id: string;
    userId: string;
    campaignName: string;
    contactName: string;
    whatsapp: string;
    email: string;
    headline: string;
    subheadline?: string;
    logoUrl?: string;
    imageUrl?: string;
    createdAt: number;
}

export type CampaignDataWithUserEmail = CampaignData & {
    userEmail?: string;
}

export async function getCampaignsByUserId(userId: string): Promise<CampaignDataWithUserEmail[]> {
    if (!userId) return []

    try {
        const snapshot = await db
            .collection("campaigns")
            .where("userId", "==", userId)
            .get()

        const campaigns = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CampaignData[]

        const userSnapshot = await db.collection("users").doc(userId).get()
        const userEmail = userSnapshot.exists ? (userSnapshot.data()?.email as string) : undefined

        return campaigns.map((campaign) => ({
            ...campaign,
            userEmail,
        }))
    } catch (error) {
        console.error("Erro ao buscar campanhas:", error)
        return []
    }
}

export async function getCampaignById(id: string): Promise<CampaignDataWithUserEmail | null> {
    const campaignSnapshot = await db.collection("campaigns").doc(id).get();

    if (!campaignSnapshot.exists) {
        return null;
    }

    return {
        id: campaignSnapshot.id,
        ...campaignSnapshot.data(),
    } as CampaignDataWithUserEmail;
}
