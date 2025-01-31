'use client';

import { useState, useRef } from 'react';
import { Download, Palette, Settings2 } from 'lucide-react';

export function LogoGenerator() {
  const [primaryColor, setPrimaryColor] = useState('#FF0000');
  const [secondaryColor, setSecondaryColor] = useState('#0066FF');
  const [size, setSize] = useState(512);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);

    // Draw PitDeck logo
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // P shape
    const pWidth = size * 0.6;
    const pHeight = size * 0.8;
    const pX = size * 0.2;
    const pY = size * 0.1;
    
    ctx.moveTo(pX, pY);
    ctx.lineTo(pX + pWidth, pY);
    ctx.quadraticCurveTo(pX + pWidth * 1.2, pY + pHeight * 0.25, pX + pWidth, pY + pHeight * 0.5);
    ctx.lineTo(pX + pWidth * 0.3, pY + pHeight * 0.5);
    ctx.lineTo(pX + pWidth * 0.3, pY + pHeight);
    ctx.lineTo(pX, pY + pHeight);
    ctx.closePath();
    
    ctx.fill();
  };

  const downloadLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'pitdeck-logo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Primary Color
            </label>
            <div className="flex gap-2">
              <Palette className="h-5 w-5 text-gray-400" />
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-white/5 border border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <Palette className="h-5 w-5 text-gray-400" />
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-10 rounded-lg bg-white/5 border border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Size (px)
            </label>
            <div className="flex gap-2">
              <Settings2 className="h-5 w-5 text-gray-400" />
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                <option value="256">256x256</option>
                <option value="512">512x512</option>
                <option value="1024">1024x1024</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateLogo}
            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
          >
            Generate Logo
          </button>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-25 group-hover:opacity-50 transition-opacity blur" />
          <div className="relative bg-black rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full aspect-square"
            />
          </div>
        </div>
      </div>

      <button
        onClick={downloadLogo}
        className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
      >
        <Download className="inline-block mr-2 h-5 w-5" />
        Download Logo
      </button>
    </div>
  );
} 