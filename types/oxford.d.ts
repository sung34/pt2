export interface OxfordApiResponse {
  id: string;
  word: string;
  results: OxfordResult[];
}

export interface OxfordResult {
  id: string;
  language: string;
  lexicalEntries: OxfordLexicalEntry[];
  type: string;
  word: string;
}

export interface OxfordLexicalEntry {
  entries: OxfordEntry[];
  language: string;
  lexicalCategory: {
    id: string;   // 예: "noun"
    text: string; // 예: "Noun"
  };
  text: string;
}

export interface OxfordEntry {
  senses: OxfordSense[];
  etymologies?: string[];
}

export interface OxfordSense {
  definitions?: string[];
  shortDefinitions?: string[];
  subsenses?: OxfordSense[];
} 