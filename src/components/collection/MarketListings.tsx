'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/utils/formatNumber';
import { CardImage } from '@/components/cards/CardImage';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, X, Tag, Hash } from 'lucide-react';
import type { Listing, Card as CardType } from '@prisma/client';

interface MarketListingsProps {
  listings: (Listing & {
    card: CardType;
  })[];
}

export function MarketListings({ listings }: MarketListingsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  const handleUpdatePrice = async (listingId: string) => {
    try {
      const response = await fetch(`/api/market/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseInt(newPrice) })
      });

      if (!response.ok) throw new Error('Failed to update price');
      
      toast.success('Price updated successfully');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update price');
    }
  };

  const handleCancelListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/market/listings/${listingId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to cancel listing');
      
      toast.success('Listing cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel listing');
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Active Listings</h3>
        <p className="text-gray-400">You don't have any cards listed on the marketplace</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <Card key={listing.id} className="relative overflow-hidden group bg-black/40 hover:bg-black/60 transition-colors">
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm">
              <Hash className="h-3 w-3 mr-1" />
              {listing.card.serialNumber}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(listing.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          <div className="p-2">
            <CardImage 
              card={listing.card} 
              className="w-full rounded-lg transition-transform group-hover:scale-[1.02]" 
              showRarity
              size="sm"
            />
          </div>

          <div className="p-3 space-y-3 bg-black/20">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-medium text-base text-white truncate">
                  {listing.card.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-xs bg-black/50">
                    {listing.card.series}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-black/50">
                    {listing.card.year}
                  </Badge>
                </div>
              </div>
              {!editingId && (
                <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-lg">
                  <Tag className="h-3.5 w-3.5 text-green-500" />
                  <p className="text-sm font-semibold text-green-500">
                    {formatNumber(listing.price)} RC
                  </p>
                </div>
              )}
            </div>

            {editingId === listing.id ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="New price"
                  className="flex-1 h-8 text-sm"
                />
                <Button size="sm" className="h-8" onClick={() => handleUpdatePrice(listing.id)}>
                  Save
                </Button>
                <Button 
                  size="sm"
                  variant="ghost" 
                  className="h-8 px-2"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline" 
                  className="flex-1 h-8 text-sm"
                  onClick={() => {
                    setEditingId(listing.id);
                    setNewPrice(listing.price.toString());
                  }}
                >
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  Edit Price
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  className="h-8 text-sm px-3"
                  onClick={() => handleCancelListing(listing.id)}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
} 