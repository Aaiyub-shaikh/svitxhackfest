export interface DiseaseInfo {
  description: string;
  symptoms: string;
  recommendations: string[];
  pesticides: string[];
  organic_treatment: string;
}

export interface PredictionTopK {
  index: number;
  label: string;
  confidence: number;
}

export interface PredictionResponse {
  success: boolean;
  predicted_index: number;
  predicted_label: string;
  probabilities?: number[];
  topk?: PredictionTopK[];
  info: DiseaseInfo;
}