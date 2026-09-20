import { SocialPlatform } from "@prisma/client";

export interface GenerateContentInput {
  goal: string;
  targetPlatform: SocialPlatform;
  tone: string;
  includeCTA: boolean;
}

export interface GenerateContentOutput {
  caption: string;
  hashtags: string[];
  cta?: string;
  platform: SocialPlatform;
  tone: string;
  reasoning: string;
}

export interface TransformContentInput {
  postId: string;
  originalContent: string;
  transformation: string;
  targetPlatform?: SocialPlatform;
  tone?: string;
}

export interface TransformContentOutput {
  caption: string;
  hashtags: string[];
  cta?: string;
  platform: SocialPlatform;
  tone: string;
  reasoning: string;
}

export interface ScoreContentInput {
  postId: string;
  content: string;
  platform: SocialPlatform;
}

export interface ScoreContentOutput {
  overall: number;
  hook: number;
  clarity: number;
  cta: number;
  recommendations: string[];
}

export interface AIProvider {
  generateContent(input: GenerateContentInput): Promise<GenerateContentOutput>;
  regenerateContent(input: GenerateContentInput): Promise<GenerateContentOutput>;
  transformContent(input: TransformContentInput): Promise<TransformContentOutput>;
  scoreContent(input: ScoreContentInput): Promise<ScoreContentOutput>;
  generateInsight(input: { organizationId: string; platform: string }): Promise<string>;
}
