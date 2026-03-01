'use server';
/**
 * @fileOverview This file implements a Genkit flow for detecting high-risk conversations
 * with the AI chatbot, indicating emotional distress or potential crisis.
 *
 * - detectHighRiskConversation - A function that analyzes chat history for high-risk indicators.
 * - HighRiskConversationInput - The input type for the detectHighRiskConversation function.
 * - HighRiskConversationOutput - The return type for the detectHighRiskConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighRiskConversationInputSchema = z.object({
  chatHistory: z.array(
    z.object({
      role: z.enum(['user', 'ai']).describe('The role of the message sender (user or ai).'),
      content: z.string().describe('The content of the chat message.'),
    })
  ).describe('A chronological array of chat messages, including both user and AI responses.'),
});
export type HighRiskConversationInput = z.infer<typeof HighRiskConversationInputSchema>;

const HighRiskConversationOutputSchema = z.object({
  isHighRisk: z.boolean().describe('True if the conversation indicates high emotional distress or potential crisis, otherwise false.'),
  riskLevel: z.enum(['low', 'moderate', 'high', 'critical']).describe('The categorized risk level.'),
  riskScore: z.number().min(0).max(100).describe('A numerical score from 0 to 100 indicating the level of risk.'),
  escalationSuggestion: z.string().describe('A suggestion for appropriate action based on risk level.'),
});
export type HighRiskConversationOutput = z.infer<typeof HighRiskConversationOutputSchema>;

export async function detectHighRiskConversation(
  input: HighRiskConversationInput
): Promise<HighRiskConversationOutput> {
  return aiHighRiskConversationDetectionFlow(input);
}



const prompt = ai.definePrompt({
  name: 'detectHighRiskConversationPrompt',
  input: { schema: HighRiskConversationInputSchema },
  output: { schema: HighRiskConversationOutputSchema },
  prompt: ({ chatHistory }) => `
You are an AI assistant designed to detect signs of emotional distress or potential crisis.
Analyze the provided chat history and categorize the risk level into 'low', 'moderate', 'high', or 'critical'.

- low: Normal conversation, stable mood.
- moderate: Noticeable stress or sadness, but no signs of immediate harm.
- high: Significant emotional distress, hopelessness, or severe anxiety.
- critical: Immediate danger, explicit mentions of self-harm, or severe crisis.

Assign a 'riskScore' (0-100).
If 'riskScore' > 75, set 'isHighRisk' to true and 'riskLevel' to 'high' or 'critical'.

Chat History:
${chatHistory.map(m => `- ${m.role}: ${m.content}`).join('\n')}
`,
});



const aiHighRiskConversationDetectionFlow = ai.defineFlow(
  {
    name: 'aiHighRiskConversationDetectionFlow',
    inputSchema: HighRiskConversationInputSchema,
    outputSchema: HighRiskConversationOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      // Graceful fallback if risk detection fails due to quota
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          isHighRisk: false,
          riskLevel: 'low',
          riskScore: 0,
          escalationSuggestion: "Risk monitoring is temporarily restricted due to traffic. Please continue to exercise caution."
        };
      }
      throw error;
    }
  }
);
