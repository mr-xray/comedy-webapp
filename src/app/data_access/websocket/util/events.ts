export enum EventIdentifier {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  AUGUMENTED_REALITY = 'AUGUMENTED_REALITY',
}

export interface VideoEventPayload {
  url: string;
  width: number;
  height: number;
  length: number;
}

export interface ImageEventPayload {
  url: string;
  width: number;
  height: number;
}

interface Answer {
  answer: string;
  correct: boolean;
}

export interface MultipleChoiceQuestionEventPayload {
  question: string;
  answers: Answer[];
}

export interface AugumentedRealityEventPayload {
  url: string;
  width: number;
  height: number;
  length: number;
}
