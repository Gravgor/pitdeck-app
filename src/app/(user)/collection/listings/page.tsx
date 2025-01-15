import { withAuth } from '@/middleware/withAuth';
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketListings } from '@/components/collection/MarketListings';
import { TradeListings } from '@/components/collection/TradeListings';

export default async function ListingsPage() {
  return withAuth(async (userId) => {
    // Get active marketplace listings
    const marketListings = await prisma.listing.findMany({
      where: {
        sellerId: userId,
        status: 'ACTIVE'
      },
      include: {
        card: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get active trade offers
    const tradeOffers = await prisma.tradeOffer.findMany({
      where: {
        userId: userId,
        status: 'PENDING'
      },
      include: {
        trade: true,
        offeredCards: true
      }
    });

    // Get trades where user is the creator
    const createdTrades = await prisma.trade.findMany({
      where: {
        senderId: userId,
        status: 'PENDING'
      },
      include: {
        offeredCards: true,
        tradeOffers: {
          include: {
            offeredCards: true
          }
        }
      }
    });

    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-white">Active Listings</h1>
          <p className="text-gray-400 text-lg">
            Manage your marketplace listings
          </p>
        </div>

        <Tabs defaultValue="market" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="market">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="market">
            <MarketListings listings={marketListings} />
          </TabsContent>

          <TabsContent value="trades">
            <TradeListings 
              tradeOffers={tradeOffers as any}
              createdTrades={createdTrades}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  });
} 