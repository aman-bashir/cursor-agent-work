export interface ThumbnailAnalysis {
  id: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  resolution: {
    width: number;
    height: number;
  };
  aspectRatio: string;
  brightness: number;
  contrast: number;
  colorVibrancy: number;
  hasFace: boolean;
  faceCount: number;
  faceSize: 'small' | 'medium' | 'large';
  faceExpression: 'neutral' | 'happy' | 'excited' | 'surprised' | 'angry';
  facePosition: 'left' | 'center' | 'right' | 'top' | 'bottom';
  hasText: boolean;
  textLength: number;
  textReadability: 'low' | 'medium' | 'high';
  textContrast: 'low' | 'medium' | 'high';
  ctrScore: number;
  suggestions: string[];
  technicalIssues: string[];
  strengths: string[];
}

export interface ThumbnailComparison {
  id: string;
  thumbnails: ThumbnailAnalysis[];
  createdAt: string;
  pollId?: string;
  pollUrl?: string;
}

export interface Poll {
  id: string;
  shortId: string;
  title?: string;
  thumbnails: string[];
  votes: Vote[];
  expiresAt: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  pollId: string;
  thumbnailIndex: number;
  voterId: string;
  createdAt: string;
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  results: {
    thumbnailIndex: number;
    votes: number;
    percentage: number;
  }[];
}

export interface PreviewMode {
  type: 'desktop' | 'mobile' | 'dark';
  label: string;
  description: string;
}

export interface YouTubeUISimulation {
  mode: PreviewMode;
  thumbnail: ThumbnailAnalysis;
  context: 'search' | 'recommended' | 'trending' | 'channel';
}
