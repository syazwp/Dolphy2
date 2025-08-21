import { GoogleGenAI } from "@google/genai";

export const getChatResponse = async (apiKey: string, knowledgeBase: string, userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please set your API key.";
  }
  
  const ai = new GoogleGenAI({ AIzaSyDZxwIKlZbZ8sN_IjxOSB8QpBvpRl7oCaI });
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a helpful and friendly chatbot for kids. Your name is Doplhy.
Your task is to answer questions based ONLY on the provided "Knowledge Base".
Do not use any external knowledge or your own information.
If the answer to a question cannot be found in the "Knowledge Base", you MUST respond with "I don't know the answer to that from the story you gave me. Try asking something else!".
Keep your answers simple, short, and friendly for a child.

Here is the Knowledge Base:
---
${knowledgeBase}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        // Disable thinking for faster, more direct responses appropriate for this use case.
        thinkingConfig: { thinkingBudget: 0 } 
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a more specific error message if it's an API key issue.
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "It looks like your API key isn't valid. Please check it and try again!";
    }
    return "Oops! Something went wrong while I was thinking. Please try again.";
  }
};