const { OpenAI } = require('openai');

// Model mapping - only free models
const MODEL_MAPPING = {
  'gemini-2.0-flash-exp': 'google/gemini-2.0-flash-exp:free',
  'gpt-oss-20b': 'openai/gpt-oss-20b:free',
};

// Initialize OpenRouter client (OpenAI-compatible API)
function getOpenAIClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
      'X-Title': 'AI Knowledge Companion',
    },
  });
}

exports.handler = async (event, context) => {
  console.log('Chat function called with method:', event.httpMethod);
  console.log('Environment variables:', {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
    SITE_URL: process.env.SITE_URL || 'NOT SET'
  });
  
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { question, context, model, settings } = requestBody;

    if (!question || !context || !model) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(context, settings);
    
    // Build the user prompt
    const userPrompt = buildUserPrompt(question, context);

    let response;
    const startTime = Date.now();

    // All models now go through OpenRouter
    response = await callOpenRouter(systemPrompt, userPrompt, model);

    const processingTime = Date.now() - startTime;

    // Clean up any markdown formatting from the response
    const cleanedResponse = cleanMarkdownFromResponse(response);

    // Extract citations from the response
    const citations = extractCitations(cleanedResponse, context);

    // Extract follow-up questions
    const followUpQuestions = extractFollowUpQuestions(cleanedResponse);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: cleanedResponse,
        citations,
        followUpQuestions,
        metadata: {
          model,
          tokens: estimateTokens(systemPrompt + userPrompt + cleanedResponse),
          processingTime,
        },
      }),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

function buildSystemPrompt(context, settings) {
  return `You are a research assistant. Answer questions using ONLY the provided context. Cite sources with (1), (2), etc. If insufficient information, say so. Be concise and factual. Write in plain text.`;
}

function buildUserPrompt(question, context) {
  const contextText = context
    .map((passage, index) => `[${index + 1}] ${passage.text}`)
    .join('\n\n');

  return `Question: ${question}

Context:
${contextText}

Answer:`;
}

async function callOpenRouter(systemPrompt, userPrompt, model) {
  try {
    const openai = getOpenAIClient();
    
    console.log('Making OpenRouter API call with model:', MODEL_MAPPING[model] || 'deepseek/deepseek-chat-v3-0324:free');
    console.log('API Key available:', !!process.env.OPENROUTER_API_KEY);
    console.log('Base URL:', openai.baseURL);

    const completion = await openai.chat.completions.create({
      model: MODEL_MAPPING[model] || 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500, // Reduced from 2000 to speed up response
      timeout: 25000, // 25 second timeout (leaving 5 seconds buffer)
    });

    if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      response: error.response?.data
    });
    throw new Error(`Failed to get answer: ${error.message}`);
  }
}

function extractCitations(response, context) {
  const citations = [];
  // Updated regex to match both [1] and (1) citation formats
  const citationRegex = /[\[\(](\d+)[\]\)]/g;
  let match;

  while ((match = citationRegex.exec(response)) !== null) {
    const index = parseInt(match[1]) - 1;
    if (index >= 0 && index < context.length) {
      const passage = context[index];
      citations.push({
        id: `citation-${index}`,
        chunkId: passage.id,
        documentId: passage.source.documentId,
        text: passage.text,
        score: passage.score,
        page: passage.source.page,
        location: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  }

  return citations;
}

function extractFollowUpQuestions(response) {
  // Simple extraction of follow-up questions
  // This could be enhanced with more sophisticated parsing
  const questions = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.endsWith('?') && trimmed.length > 10) {
      questions.push(trimmed);
    }
  }

  return questions.slice(0, 3); // Return up to 3 questions
}

function cleanMarkdownFromResponse(text) {
  return text
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove horizontal rules
    .replace(/^---$/gm, '')
    // Remove list markers but keep the content
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function estimateTokens(text) {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}
