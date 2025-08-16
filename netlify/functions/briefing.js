const { OpenAI } = require('openai');

// Initialize OpenRouter client (OpenAI-compatible API)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': 'AI Knowledge Companion',
  },
});

// Model mapping - only free models
const MODEL_MAPPING = {
  'gemini-2.0-flash-exp': 'google/gemini-2.0-flash-exp:free',
  'gpt-oss-20b': 'openai/gpt-oss-20b:free',
};

exports.handler = async (event, context) => {
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
    const { collectionId, exchanges, retrievedPassages, model } = requestBody;

    if (!collectionId || !exchanges || !model) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Build the briefing prompt
    const briefingPrompt = buildBriefingPrompt(exchanges, retrievedPassages);
    
    let response;
    const startTime = Date.now();

    // All models now go through OpenRouter
    response = await callOpenRouter(briefingPrompt, model);

    const processingTime = Date.now() - startTime;

    // Parse the briefing sections
    const sections = parseBriefingSections(response);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: response,
        sections,
        metadata: {
          model,
          tokens: estimateTokens(briefingPrompt + response),
          processingTime,
        },
      }),
    };
  } catch (error) {
    console.error('Briefing function error:', error);
    
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

function buildBriefingPrompt(exchanges, retrievedPassages) {
  const exchangeText = exchanges
    .map((exchange, index) => `Q${index + 1}: ${exchange.question}\nA${index + 1}: ${exchange.answer}`)
    .join('\n\n');

  const contextText = retrievedPassages
    .map((passage, index) => `[${index + 1}] ${passage.text}`)
    .join('\n\n');

  return `Create a briefing report based on:

Q&A: ${exchangeText}

Context: ${contextText}

Format: 1. Overview 2. Key Insights 3. Risks 4. Action Items 5. Sources`;
}

async function callOpenRouter(prompt, model) {
  try {
    // Debug: Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }

    console.log('Making OpenRouter API call for briefing with model:', MODEL_MAPPING[model] || 'deepseek/deepseek-chat-v3-0324:free');
    console.log('API Key available:', !!process.env.OPENROUTER_API_KEY);

    const completion = await openai.chat.completions.create({
      model: MODEL_MAPPING[model] || 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: 'You are a research analyst. Create structured briefing reports with key insights, risks, and action items.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000, // Reduced from 3000
      timeout: 25000, // 25 second timeout
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
    throw new Error(`Failed to generate briefing: ${error.message}`);
  }
}

function parseBriefingSections(response) {
  const sections = [];
  const sectionRegex = /(?:^|\n)(\d+\.\s*\*\*([^*]+)\*\*|^|\n)([^*]+?)(?=\n\d+\.\s*\*\*|\n\d+\.\s*[^*]|$)/gs;
  let match;

  while ((match = sectionRegex.exec(response)) !== null) {
    const sectionTitle = match[2] || match[1];
    const content = match[3]?.trim();
    
    if (content) {
      sections.push({
        id: `section-${sections.length}`,
        type: getSectionType(sectionTitle),
        title: sectionTitle,
        content,
        citations: extractCitationsFromText(content),
        order: sections.length,
      });
    }
  }

  // If no sections were parsed, create a default structure
  if (sections.length === 0) {
    sections.push({
      id: 'section-0',
      type: 'overview',
      title: 'Overview',
      content: response,
      citations: extractCitationsFromText(response),
      order: 0,
    });
  }

  return sections;
}

function getSectionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('overview') || lowerTitle.includes('summary')) {
    return 'overview';
  } else if (lowerTitle.includes('insight')) {
    return 'key-insights';
  } else if (lowerTitle.includes('risk')) {
    return 'risks';
  } else if (lowerTitle.includes('action') || lowerTitle.includes('recommendation')) {
    return 'action-items';
  } else if (lowerTitle.includes('source')) {
    return 'sources';
  } else {
    return 'custom';
  }
}

function extractCitationsFromText(text) {
  const citations = [];
  const citationRegex = /\[(\d+)\]/g;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    citations.push({
      id: `citation-${match[1]}`,
      location: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  return citations;
}

function estimateTokens(text) {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}
