'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';

export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 1) {
    return (
      <>
        <div 
          className="relative aspect-video rounded-xl overflow-hidden my-6 group cursor-pointer"
          onClick={() => setSelectedImage(images[0])}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
          <Image
            src={images[0]}
            alt="Feature preview"
            fill
            className="object-cover filter blur-[2px] group-hover:blur-0 transition-all"
          />
        </div>

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative max-w-7xl w-full max-h-[90vh] aspect-video">
              <Image
                src={selectedImage}
                alt="Feature preview"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 my-6">
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <Image
              src={image}
              alt={`Feature preview ${index + 1}`}
              fill
              className="object-cover filter blur-[2px] group-hover:blur-0 transition-all"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-7xl w-full max-h-[90vh] aspect-video">
            <Image
              src={selectedImage}
              alt="Feature preview"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      )}
    </>
  );
}