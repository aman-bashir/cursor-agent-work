import { Color } from './colorGenerator';

export interface ExportFormat {
  name: string;
  extension: string;
  mimeType: string;
  generate: (colors: Color[], paletteName?: string) => string | Blob;
}

export const exportFormats: ExportFormat[] = [
  {
    name: 'CSS Variables',
    extension: 'css',
    mimeType: 'text/css',
    generate: (colors: Color[], paletteName = 'palette') => {
      const css = `:root {
  /* ${paletteName} Color Palette */
${colors.map((color, index) => `  --color-${index + 1}: ${color.hex};`).join('\n')}
${colors.map((color, index) => `  --color-${index + 1}-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};`).join('\n')}
}

/* Usage Examples */
.example {
  background-color: var(--color-1);
  color: var(--color-2);
  border: 1px solid var(--color-3);
}`;
      return css;
    }
  },
  {
    name: 'Tailwind Config',
    extension: 'js',
    mimeType: 'application/javascript',
    generate: (colors: Color[], paletteName = 'palette') => {
      const config = `module.exports = {
  theme: {
    extend: {
      colors: {
        '${paletteName.toLowerCase()}': {
${colors.map((color, index) => `          ${index + 1}: '${color.hex}',`).join('\n')}
        }
      }
    }
  }
}`;
      return config;
    }
  },
  {
    name: 'SCSS Variables',
    extension: 'scss',
    mimeType: 'text/scss',
    generate: (colors: Color[], paletteName = 'palette') => {
      const scss = `// ${paletteName} Color Palette
${colors.map((color, index) => `$${paletteName.toLowerCase()}-${index + 1}: ${color.hex};`).join('\n')}

// Usage Examples
.example {
  background-color: $${paletteName.toLowerCase()}-1;
  color: $${paletteName.toLowerCase()}-2;
  border: 1px solid $${paletteName.toLowerCase()}-3;
}`;
      return scss;
    }
  },
  {
    name: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    generate: (colors: Color[], paletteName = 'palette') => {
      const json = {
        name: paletteName,
        colors: colors.map((color, index) => ({
          id: index + 1,
          hex: color.hex,
          rgb: color.rgb,
          hsl: color.hsl,
          cmyk: color.cmyk,
          name: color.name
        }))
      };
      return JSON.stringify(json, null, 2);
    }
  },
  {
    name: 'Figma Tokens',
    extension: 'json',
    mimeType: 'application/json',
    generate: (colors: Color[], paletteName = 'palette') => {
      const tokens = {
        [paletteName]: {
          colors: colors.reduce((acc, color, index) => {
            acc[`color-${index + 1}`] = {
              value: color.hex,
              type: 'color'
            };
            return acc;
          }, {} as any)
        }
      };
      return JSON.stringify(tokens, null, 2);
    }
  },
  {
    name: 'Adobe ASE',
    extension: 'ase',
    mimeType: 'application/octet-stream',
    generate: (colors: Color[], paletteName = 'palette') => {
      // Simplified ASE format - in a real implementation, you'd use a proper ASE library
      const aseContent = `Adobe Swatch Exchange
${paletteName}
${colors.length}
${colors.map(color => `${color.name}\n${color.hex}`).join('\n')}`;
      return new Blob([aseContent], { type: 'application/octet-stream' });
    }
  },
  {
    name: 'Sketch Palette',
    extension: 'json',
    mimeType: 'application/json',
    generate: (colors: Color[], paletteName = 'palette') => {
      const sketchPalette = {
        compatibleVersion: '2.0',
        pluginVersion: '2.0.0',
        colors: colors.map(color => ({
          red: color.rgb.r / 255,
          green: color.rgb.g / 255,
          blue: color.rgb.b / 255,
          alpha: 1
        }))
      };
      return JSON.stringify(sketchPalette, null, 2);
    }
  },
  {
    name: 'CSS Classes',
    extension: 'css',
    mimeType: 'text/css',
    generate: (colors: Color[], paletteName = 'palette') => {
      const css = `.${paletteName.toLowerCase()}-palette {
  /* ${paletteName} Color Palette */
}

${colors.map((color, index) => `.${paletteName.toLowerCase()}-${index + 1} {
  color: ${color.hex};
}

.${paletteName.toLowerCase()}-${index + 1}-bg {
  background-color: ${color.hex};
}

.${paletteName.toLowerCase()}-${index + 1}-border {
  border-color: ${color.hex};
}`).join('\n\n')}`;
      return css;
    }
  },
  {
    name: 'Swift/iOS',
    extension: 'swift',
    mimeType: 'text/swift',
    generate: (colors: Color[], paletteName = 'palette') => {
      const swift = `import UIKit

extension UIColor {
    // ${paletteName} Color Palette
${colors.map((color, index) => `    static let ${paletteName.toLowerCase()}${index + 1} = UIColor(red: ${(color.rgb.r / 255).toFixed(3)}, green: ${(color.rgb.g / 255).toFixed(3)}, blue: ${(color.rgb.b / 255).toFixed(3)}, alpha: 1.0)`).join('\n')}
}`;
      return swift;
    }
  },
  {
    name: 'Android/Kotlin',
    extension: 'kt',
    mimeType: 'text/kotlin',
    generate: (colors: Color[], paletteName = 'palette') => {
      const kotlin = `// ${paletteName} Color Palette
object ${paletteName}Colors {
${colors.map((color, index) => `    val color${index + 1} = Color(0x${color.hex.replace('#', '')})`).join('\n')}
}`;
      return kotlin;
    }
  }
];

export function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject(new Error('Failed to copy to clipboard'));
      }
      document.body.removeChild(textArea);
    });
  }
}

export function generatePaletteImage(colors: Color[], width: number = 800, height: number = 200): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  const colorWidth = width / colors.length;
  
  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex;
    ctx.fillRect(index * colorWidth, 0, colorWidth, height);
  });
  
  return canvas.toDataURL('image/png');
}

export function generateDetailedPaletteImage(
  colors: Color[], 
  width: number = 400, 
  height: number = 600
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const colorHeight = height / colors.length;
  const textHeight = 20;
  const colorSwatchHeight = colorHeight - textHeight;
  
  colors.forEach((color, index) => {
    const y = index * colorHeight;
    
    // Color swatch
    ctx.fillStyle = color.hex;
    ctx.fillRect(0, y, width, colorSwatchHeight);
    
    // Text
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(color.hex, 10, y + colorSwatchHeight + 15);
    
    // RGB
    ctx.font = '12px Arial';
    ctx.fillText(`RGB: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`, 10, y + colorSwatchHeight + 30);
  });
  
  return canvas.toDataURL('image/png');
}

export function generateShareableUrl(colors: Color[]): string {
  const colorHexes = colors.map(c => c.hex.replace('#', '')).join('-');
  return `${window.location.origin}${window.location.pathname}?colors=${colorHexes}`;
}

export function parseShareableUrl(url: string): string[] | null {
  try {
    const urlObj = new URL(url);
    const colorsParam = urlObj.searchParams.get('colors');
    if (!colorsParam) return null;
    
    const hexValues = colorsParam.split('-');
    return hexValues.map(hex => `#${hex}`);
  } catch {
    return null;
  }
}
