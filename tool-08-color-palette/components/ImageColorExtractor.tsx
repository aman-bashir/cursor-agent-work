'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Download,
  X,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ExtractedColor {
  color: string;
  percentage: number;
  x: number;
  y: number;
}

interface ImageColorExtractorProps {
  onColorsExtracted: (colors: string[]) => void;
}

export default function ImageColorExtractor({ onColorsExtracted }: ImageColorExtractorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPercentages, setShowPercentages] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        extractColorsFromImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsFromImage = (imageSrc: string) => {
    setIsProcessing(true);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Sample pixels (every 10th pixel for performance)
      const colorMap = new Map<string, { count: number; x: number; y: number }>();
      const sampleRate = 10;
      
      for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Convert to hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        
        // Quantize colors to reduce noise
        const quantizedHex = quantizeColor(hex);
        
        if (colorMap.has(quantizedHex)) {
          colorMap.get(quantizedHex)!.count++;
        } else {
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          colorMap.set(quantizedHex, { count: 1, x, y });
        }
      }
      
      // Convert to array and sort by frequency
      const colors: ExtractedColor[] = Array.from(colorMap.entries())
        .map(([color, data]) => ({
          color,
          percentage: (data.count / (pixels.length / 4 / sampleRate)) * 100,
          x: data.x,
          y: data.y
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Top 10 colors
      
      setExtractedColors(colors);
      onColorsExtracted(colors.map(c => c.color));
      setIsProcessing(false);
    };
    
    img.src = imageSrc;
  };

  const quantizeColor = (hex: string) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Quantize to reduce color variations
    const quantizedR = Math.round(r / 32) * 32;
    const quantizedG = Math.round(g / 32) * 32;
    const quantizedB = Math.round(b / 32) * 32;
    
    // Convert back to hex
    return `#${quantizedR.toString(16).padStart(2, '0')}${quantizedG.toString(16).padStart(2, '0')}${quantizedB.toString(16).padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadPalette = () => {
    const data = {
      name: 'Extracted Color Palette',
      colors: extractedColors.map(c => c.color),
      type: 'extracted',
      harmony: 'extracted',
      createdAt: new Date().toISOString(),
      source: 'image'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-palette.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeImage = () => {
    setImage(null);
    setExtractedColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Image Color Extractor
        </h2>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Upload an Image
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Drag and drop an image or click to browse
            </p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Choose File
            </button>
          </div>
        ) : (
          <div className="relative">
            <img
              src={image}
              alt="Uploaded"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Extracting colors from image...
          </p>
        </div>
      )}

      {/* Extracted Colors */}
      {extractedColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Extracted Colors
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPercentages(!showPercentages)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors",
                  showPercentages 
                    ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                )}
              >
                {showPercentages ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Percentages
              </button>
              <button
                onClick={downloadPalette}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {extractedColors.map((colorData, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Color Swatch */}
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: colorData.color }}
                />
                
                {/* Color Info */}
                <div className="p-3 bg-white dark:bg-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-slate-900 dark:text-white">
                      {colorData.color}
                    </span>
                    <button
                      onClick={() => copyToClipboard(colorData.color, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400 hover:text-purple-600" />
                      )}
                    </button>
                  </div>
                  
                  {showPercentages && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {colorData.percentage.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Color Bar Preview */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color Distribution
            </h4>
            <div className="flex h-8 rounded-lg overflow-hidden shadow-md">
              {extractedColors.map((colorData, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center"
                  style={{ 
                    backgroundColor: colorData.color,
                    width: `${colorData.percentage}%`
                  }}
                >
                  {colorData.percentage > 5 && (
                    <span className="text-xs font-medium text-white mix-blend-difference">
                      {colorData.percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!image && (
        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            How it works:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Upload any image (JPG, PNG, GIF, WebP)</li>
            <li>• We analyze the image and extract the most prominent colors</li>
            <li>• Colors are quantized to reduce noise and grouped by similarity</li>
            <li>• You can copy individual colors or download the entire palette</li>
          </ul>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
