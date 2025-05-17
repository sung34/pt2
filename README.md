// 형태소 기본 타입
export type MorphType = "ROOT" | "PREFIX" | "SUFFIX" | "COMPOUND";
export type WordBookType = "중학기초1200" | "중학기본1800" | "고등기본1800" | "능률보카";
export type PartOfSpeech = "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB" | "PRONOUN" | "PREPOSITION" | "CONJUNCTION" | "INTERJECTION" | "N/A";

export type BaseWord<T extends PartOfSpeech, M extends MorphType> = {
  term: string;
  meanings: string[];
  origin?: string;
  wordBook: WordBookType;
  partOfSpeech: T;
  type: M;
};

export interface VerbExtras {
  transitive: boolean;
  intransitive: boolean;
  phrasalForms?: string[];
}

export interface AdjectiveExtras {
  comparativeForm?: string;
  superlativeForm?: string;
  prefix?: PrefixWord;
  suffix?: SuffixWord;
  root?: RootWord;
}

export interface NounExtras {
  pluralForm?: string;
  countable: boolean;
}

export interface AdverbExtras {
  comparativeForm?: string;
  superlativeForm?: string;
}

export interface CompoundExtras {
  prefix?: PrefixWord;
  root: RootWord;
  suffix?: SuffixWord;
}

export type Word<T extends PartOfSpeech, M extends MorphType> = BaseWord<T, M> & (
  T extends "VERB" ? VerbExtras :
  T extends "ADJECTIVE" ? AdjectiveExtras :
  T extends "NOUN" ? NounExtras :
  T extends "ADVERB" ? AdverbExtras :
  T extends "PRONOUN" | "PREPOSITION" | "CONJUNCTION" | "INTERJECTION" ? {} :
  T extends "COMPOUND" ? CompoundExtras :
  {}
);

export type RootWord = Word<"VERB" | "NOUN" | "ADJECTIVE" | "ADVERB", "ROOT">;
export type PrefixWord = Word<"N/A", "PREFIX"> & { relatedForms?: string[] };
export type SuffixWord = Word<"N/A", "SUFFIX"> & { relatedForms?: string[] }; 