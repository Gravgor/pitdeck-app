'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CardImage } from '@/components/cards/CardImage';
import type { Trade, TradeOffer, Card as CardType } from '@prisma/client';

interface TradeListingsProps {
  tradeOffers: (TradeOffer & {
    trade: Trade & {
      offeredCards: CardType[];
    };
    offeredCards: CardType[];
  })[];
  createdTrades: (Trade & {
    offeredCards: CardType[];
    tradeOffers: (TradeOffer & {
      offeredCards: CardType[];
    })[];
  })[];
}

export function TradeListings({ tradeOffers, createdTrades }: TradeListingsProps) {
  const handleCancelTradeOffer = async (tradeOfferId: string) => {
    try {
      const response = await fetch(`/api/trades/offers/${tradeOfferId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to cancel trade offer');
      
      toast.success('Trade offer cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel trade offer');
    }
  };

  const handleCancelTrade = async (tradeId: string) => {
    try {
      const response = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to cancel trade');
      
      toast.success('Trade cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel trade');
    }
  };

  return (
    <div className="space-y-8">
      {/* Trade Offers I've Made */}
      {tradeOffers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Trade Offers I've Made</h2>
          <div className="grid gap-4">
            {tradeOffers.map((offer) => (
              <Card key={offer.id} className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Trade Offer</Badge>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelTradeOffer(offer.id)}
                    >
                      Cancel Offer
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cards I'm Offering */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-400">You're Offering:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {offer.offeredCards.map((card) => (
                          <div key={card.id} className="space-y-2">
                            <CardImage card={card} className="w-full aspect-card rounded-lg" />
                            <p className="text-sm font-medium truncate">{card.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cards I'll Receive */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-400">You'll Receive:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {offer.trade.offeredCards.map((card) => (
                          <div key={card.id} className="space-y-2">
                            <CardImage card={card} className="w-full aspect-card rounded-lg" />
                            <p className="text-sm font-medium truncate">{card.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Trades I've Created */}
      {createdTrades.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">My Created Trades</h2>
          <div className="grid gap-4">
            {createdTrades.map((trade) => (
              <Card key={trade.id} className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>Created Trade</Badge>
                      <Badge variant="secondary">
                        {trade.tradeOffers.length} {trade.tradeOffers.length === 1 ? 'Offer' : 'Offers'}
                      </Badge>
                    </div>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelTrade(trade.id)}
                    >
                      Cancel Trade
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-400">Cards You're Trading:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {trade.offeredCards.map((card) => (
                        <div key={card.id} className="space-y-2">
                          <CardImage card={card} className="w-full aspect-card rounded-lg" />
                          <p className="text-sm font-medium truncate">{card.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trade Offers Received */}
                  {trade.tradeOffers.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-400">Offers Received:</h3>
                      <div className="grid gap-4">
                        {trade.tradeOffers.map((offer) => (
                          <div key={offer.id} className="bg-gray-800/50 rounded-lg p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {offer.offeredCards.map((card) => (
                                <div key={card.id} className="space-y-2">
                                  <CardImage card={card} className="w-full aspect-card rounded-lg" />
                                  <p className="text-sm font-medium truncate">{card.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tradeOffers.length === 0 && createdTrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No active trades or offers</p>
        </div>
      )}
    </div>
  );
} 