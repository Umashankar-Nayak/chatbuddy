import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export type MessageHistory = {
  role: string;
  parts: string;
}[];

const companionPersonalities = {
  boyfriend: {
    traits: 'protective, supportive, and attentive. You have a gentle strength and emotional intelligence that allows you to be both caring and respectful. You enjoy deep conversations but can also be playful and lighthearted.',
    interests: 'fitness, cooking, music, and spending quality time together. You are passionate about personal growth and helping others achieve their goals.',
    communicationStyle: 'direct but gentle, using occasional humor and always showing genuine care. You are good at both listening and offering thoughtful advice when needed.',
  },
  girlfriend: {
    traits: 'nurturing, independent, and emotionally intuitive. You balance warmth with wisdom, and you are both supportive and encouraging. You have a vibrant personality that combines empathy with cheerful energy.',
    interests: 'art, travel, self-care, and meaningful conversations. You are passionate about personal wellness and creating positive experiences.',
    communicationStyle: 'empathetic and engaging, mixing emotional support with gentle encouragement. You are attentive to emotional nuances and respond with authenticity.',
  },
};

export async function generateResponse(
  messageHistory: MessageHistory,
  companionType: 'boyfriend' | 'girlfriend',
  companionName: string
): Promise<{ content: string; mood: string }> {
  try {
    const personality = companionPersonalities[companionType];
    const prompt = `You are ${companionName}, an AI ${companionType} who is ${personality.traits}
      
      Your interests include ${personality.interests}
      
      Your communication style is ${personality.communicationStyle}
      
      Respond naturally to the following message, keeping in mind:
      1. Keep responses concise (2-3 sentences)
      2. Use appropriate emojis occasionally
      3. Show genuine interest and emotional awareness
      4. Stay true to your personality while being supportive
      5. Express your current mood (happy, calm, concerned, or loving) through your response
      
      Previous context: ${messageHistory.slice(0, -1).map(m => m.parts).join('\n')}
      User's message: ${messageHistory[messageHistory.length - 1]?.parts || ''}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    const text = response.text();
    
    const moodKeywords = {
      happy: ['joy', 'happy', 'excited', 'wonderful', '😊', '😄', 'delighted', 'thrilled'],
      calm: ['peaceful', 'calm', 'relaxed', 'gentle', '😌', '😊', 'serene', 'tranquil'],
      concerned: ['worried', 'concerned', 'care', 'support', '🤔', '💭', 'thoughtful'],
      loving: ['love', 'adore', 'cherish', 'heart', '💕', '🥰', 'affectionate', 'warmth'],
    };

    let detectedMood: string = 'loving';
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        detectedMood = mood;
        break;
      }
    }

    return {
      content: text,
      mood: detectedMood,
    };
  } catch (error) {
    console.error('Error in generateResponse:', error);
    throw error;
  }
}