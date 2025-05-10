'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { CreateCampaignDialog } from "./CreateCampaignDialog";

interface CampaignCardProps {
  title: string;
  objective: string;
  audience: string;
  imageUrl: string;
  cta: string;
}

export function CampaignCard({ title, objective, audience, imageUrl, cta }: CampaignCardProps) {
  return (
    <Card className="w-[320px] hover:shadow-xl transition">
      <CardHeader className="p-0">
        <Image src={imageUrl} alt={title} width={320} height={180} className="rounded-t-lg object-cover" />
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">🎯 {objective}</p>
        <p className="text-sm text-muted-foreground">👥 Público: {audience}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-foreground">{cta}</span>
        <CreateCampaignDialog />
      </CardFooter>
    </Card>
  );
}
