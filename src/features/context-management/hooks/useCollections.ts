import { useState } from 'react';

interface Collection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  lastUpdated: string;
}

export function useCollections() {
  const [collections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Research Project Alpha',
      description: 'Documents and URLs for the main research project',
      documentCount: 5,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Competitor Analysis',
      description: 'Analysis of competitor products and strategies',
      documentCount: 3,
      lastUpdated: '2024-01-10'
    }
  ]);

  return {
    collections,
  };
}
