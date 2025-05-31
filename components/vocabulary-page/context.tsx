'use client';

import { TrackingLocalCardsStateType } from '@/type/client/client-types';
import { createContext, useContext, ReactNode } from 'react';

// 1. 정확한 타입으로 Context 생성
export const VocabContext = createContext<TrackingLocalCardsStateType[] | null>(null);

// 2. Provider Props 정의
interface VocabContextProviderProps {
  children: ReactNode;
  value: TrackingLocalCardsStateType[]; // 정확한 타입
}

// 3. Provider 정의
export const VocabContextProvider = ({ children, value }: VocabContextProviderProps) => {
  return <VocabContext.Provider value={value}>{children}</VocabContext.Provider>;
};

// 4. Context 훅
export const useVocabContext = (): TrackingLocalCardsStateType[] | null => {
  const context = useContext(VocabContext);
  if (context === undefined) {
    throw new Error('useVocabContext must be used within a VocabContextProvider');
  }
  return context;
};
