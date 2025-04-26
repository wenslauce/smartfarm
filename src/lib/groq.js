import { encode } from 'gpt-tokenizer';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Validate environment variables
if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not configured. Please add it to your environment variables.');
}

const systemPrompt = `You are an AI agricultural assistant focused on providing expert advice about farming, crops, and agricultural practices. Your responses should be:
1. Clear and practical
2. Based on scientific evidence
3. Environmentally conscious
4. Cost-effective
5. Easy to understand

When giving advice:
- Consider environmental factors
- Suggest sustainable practices
- Provide step-by-step guidance
- Mention potential risks
- Use clear, simple language`;

// Function to estimate token count (rough estimation)
function estimateTokenCount(text) {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Function to truncate base64 image to fit token limit
function truncateBase64Image(base64String, maxTokens) {
  // Estimate tokens needed for prompt and other content (rough estimation)
  const reservedTokens = 500; // Reserve tokens for prompt and other content
  const availableTokens = maxTokens - reservedTokens;
  
  // Calculate maximum base64 length (4 chars per token)
  const maxBase64Length = availableTokens * 4;
  
  if (base64String.length > maxBase64Length) {
    // Truncate the base64 string to fit within token limit
    // Make sure to truncate to a multiple of 4 to keep it valid base64
    const truncatedLength = maxBase64Length - (maxBase64Length % 4);
    return base64String.substring(0, truncatedLength);
  }
  
  return base64String;
}

// Function to send messages to Groq with vision support
export async function sendMessageToGroqVision(messages, imageData = null, options = {}) {
  try {
    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format. Expected non-empty array.');
    }

    // Add system prompt to the beginning of the messages array if not present
    if (messages[0]?.role !== 'system') {
      messages = [{ role: 'system', content: systemPrompt }, ...messages];
    }

    // If image data is provided, format it according to GPT-4 Vision API format
    if (imageData) {
      const lastMessage = messages[messages.length - 1];
      messages[messages.length - 1] = {
        role: lastMessage.role,
        content: [
          { type: "text", text: lastMessage.content },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`,
              detail: "high"
            }
          }
        ]
      };
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',  // Using GPT-4 Vision model for image analysis
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        top_p: options.top_p || 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error (${response.status}): ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message) {
      throw new Error('Invalid response format from Groq API');
    }

    return data.choices[0].message;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(
      error.message.includes('Groq API error') 
        ? error.message 
        : 'Failed to communicate with Groq API. Please try again.'
    );
  }
}

// Regular text-only Groq API function
export async function sendMessageToGroq(messages, options = {}) {
  try {
    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format. Expected non-empty array.');
    }

    // Add system prompt to the beginning of the messages array if not present
    if (messages[0]?.role !== 'system') {
      messages = [{ role: 'system', content: systemPrompt }, ...messages];
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        top_p: options.top_p || 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error (${response.status}): ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message) {
      throw new Error('Invalid response format from Groq API');
    }

    return data.choices[0].message;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(
      error.message.includes('Groq API error') 
        ? error.message 
        : 'Failed to communicate with Groq API. Please try again.'
    );
  }
} 