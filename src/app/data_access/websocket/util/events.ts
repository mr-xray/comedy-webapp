export enum EventIdentifier {
  Video = 'VIDEO',
  Image = 'IMAGE',
  MultipleChoice = 'MULTIPLE_CHOICE',
  AugmentedReality = 'AUGMENTED_REALITY',
}

export interface VideoEventPayload {
  url: string;
  width?: string;
  height?: string;
  length?: number;
  borderRadius?: string;
}

export interface ImageEventPayload {
  url: string;
  width?: string;
  height?: string;
  borderRadius?: string;
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
  text?: string;
  height?: number;
  width?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    x: number;
    y: number;
    z: number;
  };
}
