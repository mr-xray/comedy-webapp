export enum EventIdentifier {
  Video = 'VIDEO',
  Image = 'IMAGE',
  MultipleChoice = 'MULTIPLE_CHOICE',
  AugmentedReality = 'AUGMENTED_REALITY',
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

export interface AugmentedRealityEventPayload {
  url: string;
  width: number;
  height: number;
  length: number;
}
