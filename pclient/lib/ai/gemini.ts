import { GoogleGenerativeAI } from "@google/genai";
import env from "@/lib/env";
import { logger } from "@/lib/logger";
import type { AIProvider, GenerateContentInput, GenerateContentOutput, TransformContentInput, TransformContentOutput, ScoreContentInput, ScoreContentOutput } from "./types";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    this.client = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY || "");
    this.model = "gemini-1.5-flash";
  }

  async generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
    try {
      const systemPrompt = `You are a social media content expert. Generate engaging content for ${input.targetPlatform}.
Goal: ${input.goal}
Tone: ${input.tone}
${input.includeCTA ? "Include a call-to-action." : ""}

Format your response as JSON with:
{
  "caption": "The main content",
  "hashtags": ["hashtag1", "hashtag2"],
  "cta": "Call to action if applicable",
  "reasoning": "Brief explanation of why this content works"
}`;

      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const response = await model.generateContent("Generate social media content");
      const text = response.response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const content = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        caption: text,
        hashtags: ["#socialmedia", "#growth"],
        cta: input.includeCTA ? "Share your thoughts!" : undefined,
        platform: input.targetPlatform,
        tone: input.tone,
        reasoning: "Generated content for engagement",
      };

      logger.info("AI content generated", { platform: input.targetPlatform });

      return {
        caption: content.caption,
        hashtags: content.hashtags || [],
        cta: content.cta,
        platform: input.targetPlatform,
        tone: input.tone,
        reasoning: content.reasoning,
      };
    } catch (error) {
      logger.error("Failed to generate AI content", error);
      throw new Error("Failed to generate AI content");
    }
  }

  async regenerateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
    return this.generateContent(input);
  }

  async transformContent(input: TransformContentInput): Promise<TransformContentOutput> {
    try {
      const systemPrompt = `You are a social media content expert. Transform the following content.
Original content: ${input.originalContent}
Transformation: ${input.transformation}
${input.targetPlatform ? `Target platform: ${input.targetPlatform}` : ""}
${input.tone ? `Tone: ${input.tone}` : ""}

Format your response as JSON with:
{
  "caption": "The transformed content",
  "hashtags": ["hashtag1", "hashtag2"],
  "cta": "Call to action if applicable",
  "platform": "The platform this is optimized for",
  "tone": "The tone used",
  "reasoning": "Brief explanation of the transformation"
}`;

      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const response = await model.generateContent("Transform this content");
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const content = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        caption: text,
        hashtags: [],
        cta: undefined,
        platform: input.targetPlatform,
        tone: input.tone,
        reasoning: "Content transformed",
      };

      logger.info("Content transformed", { transformation: input.transformation });

      return {
        caption: content.caption,
        hashtags: content.hashtags || [],
        cta: content.cta,
        platform: content.platform,
        tone: content.tone,
        reasoning: content.reasoning,
      };
    } catch (error) {
      logger.error("Failed to transform content", error);
      throw new Error("Failed to transform content");
    }
  }

  async scoreContent(input: ScoreContentInput): Promise<ScoreContentOutput> {
    try {
      const systemPrompt = `You are a social media content expert. Score the following content on a scale of 0-100.
Content: ${input.content}
Platform: ${input.platform}

Format your response as JSON with:
{
  "overall": 0-100,
  "hook": 0-100,
  "clarity": 0-100,
  "cta": 0-100,
  "recommendations": ["improvement1", "improvement2"]
}`;

      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const response = await model.generateContent("Score this content");
      const text = response.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const score = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        overall: 75,
        hook: 70,
        clarity: 75,
        cta: 70,
        recommendations: ["Improve engagement", "Add hashtags"],
      };

      logger.info("Content scored", { overall: score.overall });

      return {
        overall: score.overall,
        hook: score.hook,
        clarity: score.clarity,
        cta: score.cta,
        recommendations: score.recommendations || [],
      };
    } catch (error) {
      logger.error("Failed to score content", error);
      throw new Error("Failed to score content");
    }
  }

  async generateInsight(input: { organizationId: string; platform: string }): Promise<string> {
    try {
      const systemPrompt = `You are a social media analytics expert. Generate actionable insights for a ${input.platform} account.
Provide 3-5 specific, actionable recommendations.`;

      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const response = await model.generateContent("Generate insights");
      const insights = response.response.text().split("\n").filter(Boolean);

      logger.info("Insights generated", { platform: input.platform });

      return insights.join("\n");
    } catch (error) {
      logger.error("Failed to generate insights", error);
      throw new Error("Failed to generate insights");
    }
  }
}

export const geminiProvider = new GeminiProvider();
