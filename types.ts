export interface ToxicityCategories {
  hateSpeech: boolean;
  harassment: boolean;
  sexualContent: boolean;
  dangerousContent: boolean;
  insult: boolean;
}

export interface AnalysisResult {
  toxicityScore: number; // 0 to 100
  isToxic: boolean;
  detectedLanguage: string;
  categories: ToxicityCategories;
  explanation: string;
  politeVersion: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}