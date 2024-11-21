export const dynamic = 'force-dynamic'
import { Suspense } from 'react';
import { prisma } from "@/lib/prisma";
import { PackStore } from '@/components/packs/PackStore';


async function getPacksData() {
  const packs = await prisma.pack.findMany({
    orderBy: { price: "asc" },
  });
  return packs;
}

export default async function PacksPage() {
  const packs = await getPacksData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Pack Store</h1>
      <Suspense fallback={<PackStore packs={[]} isLoading={true} />}>
        <PackStore packs={packs} />
      </Suspense>
    </div>
  );
}