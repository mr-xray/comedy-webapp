import { EventPayload } from './types';

export enum EventIdentifier {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  AUGUMENTED_REALITY = 'AUGUMENTED_REALITY',
}

export interface VideoEventPayload extends EventPayload {
  url: string;
  width: number;
  height: number;
  length: number;
}

export interface ImageEventPayload extends EventPayload {
  url: string;
  width: number;
  height: number;
}

interface Answer {
  answer: string;
  correct: boolean;
}

export interface MultipleChoiceQuestionEventPayload extends EventPayload {
  question: string;
  answers: Answer[];
}

export interface AugumentedRealityEventPayload extends EventPayload {
  url: string;
  width: number;
  height: number;
  length: number;
}
