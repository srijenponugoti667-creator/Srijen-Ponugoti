export interface GoldenData {
  query: string;
  expectedKeywords: string[];
  minRelevanceScore: number;
}

export const goldenDataset: GoldenData[] = [
  {
    query: 'How to file an urgent injunction for property encroachment?',
    expectedKeywords: ['injunction', 'encroachment', 'property', 'court', 'statutory'],
    minRelevanceScore: 0.8
  },
  {
    query: 'What is the statutory limitation period for commercial debt recovery?',
    expectedKeywords: ['limitation', 'commercial', 'debt', 'recovery', 'period'],
    minRelevanceScore: 0.8
  },
  {
    query: 'Explain the procedure under Section 138 of Negotiable Instruments Act',
    expectedKeywords: ['Section 138', 'Negotiable Instruments Act', 'cheque', 'bounce', 'procedure'],
    minRelevanceScore: 0.8
  }
];
