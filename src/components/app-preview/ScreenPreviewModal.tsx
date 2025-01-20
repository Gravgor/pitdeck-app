import { X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ScreenPreview {
  title: string;
  subtitle: string;
  image: string;
  color: string;
  features: string[];
}

interface ScreenPreviewModalProps {
  screen: ScreenPreview | null;
  onClose: () => void;
}

export function ScreenPreviewModal({ screen, onClose }: ScreenPreviewModalProps) {
  return (
    <Dialog open={!!screen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-black/95 border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        
        {screen && (
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="relative aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-[8px] border-black/80 shadow-2xl">
              <Image
                src={`/screenshots/${screen.image}.jpg`}
                alt={screen.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{screen.title}</h3>
                <p className="text-gray-400">{screen.subtitle}</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Key Features</h4>
                <ul className="space-y-3">
                  {screen.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 