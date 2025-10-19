import { ThumbnailAnalysis } from './types';

// Mock image analysis functions - in a real implementation, these would use
// libraries like Sharp, face-api.js, or Tesseract.js for actual analysis

export async function analyzeThumbnail(
  imageFile: File,
  imageUrl: string
): Promise<ThumbnailAnalysis> {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const analysis: ThumbnailAnalysis = {
    id: Date.now().toString(),
    imageUrl,
    fileName: imageFile.name,
    fileSize: imageFile.size,
    resolution: await getImageResolution(imageFile),
    aspectRatio: await getAspectRatio(imageFile),
    brightness: await analyzeBrightness(imageFile),
    contrast: await analyzeContrast(imageFile),
    colorVibrancy: await analyzeColorVibrancy(imageFile),
    hasFace: await detectFace(imageFile),
    faceCount: await getFaceCount(imageFile),
    faceSize: await getFaceSize(imageFile),
    faceExpression: await getFaceExpression(imageFile),
    facePosition: await getFacePosition(imageFile),
    hasText: await detectText(imageFile),
    textLength: await getTextLength(imageFile),
    textReadability: await getTextReadability(imageFile),
    textContrast: await getTextContrast(imageFile),
    ctrScore: 0,
    suggestions: [],
    technicalIssues: [],
    strengths: []
  };

  // Calculate CTR score
  analysis.ctrScore = calculateCTRScore(analysis);
  
  // Generate suggestions and identify issues
  analysis.suggestions = generateSuggestions(analysis);
  analysis.technicalIssues = identifyTechnicalIssues(analysis);
  analysis.strengths = identifyStrengths(analysis);

  return analysis;
}

async function getImageResolution(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = URL.createObjectURL(file);
  });
}

async function getAspectRatio(file: File): Promise<string> {
  const resolution = await getImageResolution(file);
  const ratio = resolution.width / resolution.height;
  
  if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
  if (Math.abs(ratio - 4/3) < 0.1) return '4:3';
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  return `${resolution.width}:${resolution.height}`;
}

async function analyzeBrightness(file: File): Promise<number> {
  // Mock brightness analysis (0-100)
  return Math.floor(Math.random() * 40) + 30; // 30-70 range
}

async function analyzeContrast(file: File): Promise<number> {
  // Mock contrast analysis (0-100)
  return Math.floor(Math.random() * 30) + 50; // 50-80 range
}

async function analyzeColorVibrancy(file: File): Promise<number> {
  // Mock color vibrancy analysis (0-100)
  return Math.floor(Math.random() * 40) + 40; // 40-80 range
}

async function detectFace(file: File): Promise<boolean> {
  // Mock face detection - 70% chance of detecting a face
  return Math.random() > 0.3;
}

async function getFaceCount(file: File): Promise<number> {
  const hasFace = await detectFace(file);
  if (!hasFace) return 0;
  return Math.random() > 0.8 ? 2 : 1; // 20% chance of 2 faces
}

async function getFaceSize(file: File): Promise<'small' | 'medium' | 'large'> {
  const rand = Math.random();
  if (rand < 0.3) return 'small';
  if (rand < 0.7) return 'medium';
  return 'large';
}

async function getFaceExpression(file: File): Promise<'neutral' | 'happy' | 'excited' | 'surprised' | 'angry'> {
  const expressions = ['neutral', 'happy', 'excited', 'surprised', 'angry'];
  return expressions[Math.floor(Math.random() * expressions.length)] as any;
}

async function getFacePosition(file: File): Promise<'left' | 'center' | 'right' | 'top' | 'bottom'> {
  const positions = ['left', 'center', 'right', 'top', 'bottom'];
  return positions[Math.floor(Math.random() * positions.length)] as any;
}

async function detectText(file: File): Promise<boolean> {
  // Mock text detection - 60% chance of detecting text
  return Math.random() > 0.4;
}

async function getTextLength(file: File): Promise<number> {
  const hasText = await detectText(file);
  if (!hasText) return 0;
  return Math.floor(Math.random() * 20) + 5; // 5-25 characters
}

async function getTextReadability(file: File): Promise<'low' | 'medium' | 'high'> {
  const rand = Math.random();
  if (rand < 0.3) return 'low';
  if (rand < 0.7) return 'medium';
  return 'high';
}

async function getTextContrast(file: File): Promise<'low' | 'medium' | 'high'> {
  const rand = Math.random();
  if (rand < 0.2) return 'low';
  if (rand < 0.6) return 'medium';
  return 'high';
}

function calculateCTRScore(analysis: ThumbnailAnalysis): number {
  let score = 50; // Base score

  // Face detection (+15 points)
  if (analysis.hasFace) {
    score += 15;
    if (analysis.faceSize === 'large') score += 5;
    if (analysis.faceExpression === 'excited' || analysis.faceExpression === 'surprised') score += 5;
    if (analysis.facePosition === 'center') score += 3;
  }

  // Text (+10 points)
  if (analysis.hasText) {
    score += 5;
    if (analysis.textReadability === 'high') score += 5;
    if (analysis.textContrast === 'high') score += 3;
    if (analysis.textLength >= 5 && analysis.textLength <= 15) score += 2; // Optimal length
  }

  // Color vibrancy (+10 points)
  if (analysis.colorVibrancy > 70) score += 10;
  else if (analysis.colorVibrancy > 50) score += 5;

  // Contrast (+10 points)
  if (analysis.contrast > 70) score += 10;
  else if (analysis.contrast > 50) score += 5;

  // Brightness (+5 points)
  const idealBrightness = 65;
  const brightnessDiff = Math.abs(analysis.brightness - idealBrightness);
  if (brightnessDiff < 15) score += 5;

  // Technical checks (deductions)
  if (analysis.resolution.width < 1280) score -= 10;
  if (analysis.fileSize > 2000000) score -= 5;
  if (analysis.aspectRatio !== '16:9') score -= 5;
  if (analysis.faceCount > 2) score -= 5; // Too busy
  if (analysis.textLength > 20) score -= 3; // Too much text

  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(analysis: ThumbnailAnalysis): string[] {
  const suggestions: string[] = [];

  if (!analysis.hasFace) {
    suggestions.push('Consider adding a face - thumbnails with faces get 15% higher CTR');
  }

  if (analysis.faceSize === 'small') {
    suggestions.push('Make the face larger - bigger faces perform better');
  }

  if (analysis.faceExpression === 'neutral') {
    suggestions.push('Use a more expressive face - excited or surprised expressions work better');
  }

  if (!analysis.hasText) {
    suggestions.push('Add some text to explain what the video is about');
  }

  if (analysis.textReadability === 'low') {
    suggestions.push('Improve text readability - use larger, bolder fonts');
  }

  if (analysis.textContrast === 'low') {
    suggestions.push('Increase text contrast for better readability');
  }

  if (analysis.colorVibrancy < 50) {
    suggestions.push('Make colors more vibrant - bright colors catch attention');
  }

  if (analysis.contrast < 60) {
    suggestions.push('Increase overall contrast for better visual impact');
  }

  if (analysis.brightness < 40 || analysis.brightness > 80) {
    suggestions.push('Adjust brightness - aim for 50-70% for optimal visibility');
  }

  if (analysis.resolution.width < 1280) {
    suggestions.push('Use higher resolution - minimum 1280x720 recommended');
  }

  if (analysis.aspectRatio !== '16:9') {
    suggestions.push('Use 16:9 aspect ratio for best YouTube compatibility');
  }

  return suggestions;
}

function identifyTechnicalIssues(analysis: ThumbnailAnalysis): string[] {
  const issues: string[] = [];

  if (analysis.resolution.width < 1280) {
    issues.push('Low resolution');
  }

  if (analysis.fileSize > 2000000) {
    issues.push('Large file size');
  }

  if (analysis.aspectRatio !== '16:9') {
    issues.push('Non-standard aspect ratio');
  }

  if (analysis.faceCount > 2) {
    issues.push('Too many faces');
  }

  if (analysis.textLength > 25) {
    issues.push('Too much text');
  }

  return issues;
}

function identifyStrengths(analysis: ThumbnailAnalysis): string[] {
  const strengths: string[] = [];

  if (analysis.hasFace && analysis.faceSize === 'large') {
    strengths.push('Large, prominent face');
  }

  if (analysis.faceExpression === 'excited' || analysis.faceExpression === 'surprised') {
    strengths.push('Expressive face');
  }

  if (analysis.hasText && analysis.textReadability === 'high') {
    strengths.push('Clear, readable text');
  }

  if (analysis.colorVibrancy > 70) {
    strengths.push('Vibrant colors');
  }

  if (analysis.contrast > 70) {
    strengths.push('High contrast');
  }

  if (analysis.resolution.width >= 1280 && analysis.aspectRatio === '16:9') {
    strengths.push('Optimal technical specs');
  }

  return strengths;
}
