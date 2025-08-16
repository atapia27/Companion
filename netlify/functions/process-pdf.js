const pdfjsLib = require('pdfjs-dist');

// Configure PDF.js worker for server-side processing
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

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
    const { pdfData, filename } = requestBody;

    if (!pdfData) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'PDF data is required' }),
      };
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(pdfData, 'base64');

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let text = '';
    const metadata = {
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
      creationDate: '',
      modificationDate: '',
    };

    // Extract metadata
    try {
      const info = await pdf.getMetadata();
      if (info.info) {
        const pdfInfo = info.info;
        metadata.title = pdfInfo.Title || '';
        metadata.author = pdfInfo.Author || '';
        metadata.subject = pdfInfo.Subject || '';
        metadata.keywords = pdfInfo.Keywords || '';
        metadata.creator = pdfInfo.Creator || '';
        metadata.producer = pdfInfo.Producer || '';
        metadata.creationDate = pdfInfo.CreationDate || '';
        metadata.modificationDate = pdfInfo.ModDate || '';
      }
    } catch (error) {
      console.warn('Failed to extract PDF metadata:', error);
    }

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
      
      text += `\n\n--- Page ${pageNum} ---\n\n${pageText}`;
    }

    // Clean up text
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanedText,
        metadata: {
          ...metadata,
          filename: filename || 'document.pdf',
          type: 'application/pdf',
          pages: pdf.numPages,
        },
        pages: pdf.numPages,
        confidence: 1.0,
      }),
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    
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
