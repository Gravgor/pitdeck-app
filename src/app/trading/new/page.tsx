'use client';

import { Card } from '@prisma/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardSelector } from '@/components/trades/CardSelector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function CreateTradePage() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [coins, setCoins] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCards.length === 0 && coins === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/cards/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardIds: selectedCards.map(card => card.id),
          coins,
          note
        }),
      });

      if (response.ok) {
        router.push('/trades');
      }
    } catch (error) {
      console.error('Error creating trade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Trade</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Cards to Offer (up to 8)</h2>
          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={setSelectedCards}
            maxCards={8}
          />
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium mb-2">Coins to Offer</label>
          <Input
            type="number"
            min={0}
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium mb-2">Note (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || (selectedCards.length === 0 && coins === 0)}
          >
            {isSubmitting ? 'Creating...' : 'Create Trade'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}