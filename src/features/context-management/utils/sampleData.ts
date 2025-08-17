export const sampleFiles = [
  {
    path: '/files/invoicesample.pdf',
    name: 'Invoice Sample',
    type: 'application/pdf',
    description: 'Sample PDF invoice for testing'
  },
  {
    path: '/files/sample1.docx',
    name: 'Sample Document',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Sample Word document for testing'
  },
  {
    path: '/files/sample1.txt',
    name: 'Sample Text',
    type: 'text/plain',
    description: 'Sample text file for testing'
  },
  {
    path: '/files/thinking-in-react.md',
    name: 'React Guide',
    type: 'text/markdown',
    description: 'Sample Markdown file for testing'
  }
];

export const sampleURLs = [
  {
    url: 'https://react.dev/learn/thinking-in-react',
    name: 'React Thinking Guide',
    description: 'Official React documentation about thinking in React'
  },
  {
    url: 'https://nextjs.org/docs/getting-started',
    name: 'Next.js Getting Started',
    description: 'Official Next.js documentation for beginners'
  },
  {
    url: 'https://tailwindcss.com/docs/installation',
    name: 'Tailwind CSS Docs',
    description: 'Official Tailwind CSS installation and usage guide'
  }
];

// Keep the old export for backward compatibility
export const sampleURL = sampleURLs[0];
