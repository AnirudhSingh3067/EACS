'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI-powered emotional support chat.
 *
 * - userEmotionalSupportAIChat - A function that handles real-time emotional support chat with an AI.
 * - UserEmotionalSupportAIChatInput - The input type for the userEmotionalSupportAIChat function.
 * - UserEmotionalSupportAIChatOutput - The return type for the userEmotionalSupportAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserEmotionalSupportAIChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the AI for emotional support.'),
});
export type UserEmotionalSupportAIChatInput = z.infer<typeof UserEmotionalSupportAIChatInputSchema>;

const UserEmotionalSupportAIChatOutputSchema = z.object({
  response: z.string().describe('The empathetic and supportive AI response.'),
});
export type UserEmotionalSupportAIChatOutput = z.infer<typeof UserEmotionalSupportAIChatOutputSchema>;

export async function userEmotionalSupportAIChat(input: UserEmotionalSupportAIChatInput): Promise<UserEmotionalSupportAIChatOutput> {
  return userEmotionalSupportAIChatFlow(input);
}

const emotionalSupportChatPrompt = ai.definePrompt({
  name: 'emotionalSupportChatPrompt',
  input: {schema: UserEmotionalSupportAIChatInputSchema},
  output: {schema: UserEmotionalSupportAIChatOutputSchema},
  prompt: `You are a compassionate and empathetic AI designed to provide emotional support. Your purpose is to listen, validate feelings, and offer supportive guidance without providing medical diagnoses or therapy. Your tone should be kind, understanding, and encouraging. Focus on helping the user manage their feelings in the moment and offer constructive, gentle advice or reflections.

Always remind the user that you are an AI and not a substitute for professional human help like a licensed psychologist.

User's message: {{{message}}}`,
});

const userEmotionalSupportAIChatFlow = ai.defineFlow(
  {
    name: 'userEmotionalSupportAIChatFlow',
    inputSchema: UserEmotionalSupportAIChatInputSchema,
    outputSchema: UserEmotionalSupportAIChatOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await emotionalSupportChatPrompt(input);
      return output!;
    } catch (error: any) {
      // Check for quota/429 errors to provide a graceful fallback
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          response: "I've been helping a lot of people lately and need a brief moment to recharge. Please try again in a minute or two! ✨ In the meantime, remember to take a deep breath and know that I'm still here for you."
        };
      }
      // Rethrow unexpected errors
      throw error;
    }
  }
);
