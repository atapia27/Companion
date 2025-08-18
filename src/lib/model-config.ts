export type AIModel = 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api';

export interface ModelOption {
  value: AIModel;
  label: string;
  description: string;
  isDefault?: boolean;
  isDisabled?: boolean;
}

export const AI_MODELS: ModelOption[] = [
  {
    value: 'gpt-oss-20b',
    label: 'GPT-OSS-20B',
    description: 'Free - Default',
    isDefault: true,
  },
  {
    value: 'gemini-2.0-flash-exp',
    label: 'Gemini 2.0 Flash',
    description: 'Free',
  },
  {
    value: 'mock-api',
    label: 'Mock API',
    description: 'Testing',
  },
];

export const DEFAULT_MODEL: AIModel = 'gpt-oss-20b';

export function getModelDisplayName(model: AIModel): string {
  const modelOption = AI_MODELS.find(m => m.value === model);
  return modelOption?.label || model;
}

export function getModelDescription(model: AIModel): string {
  const modelOption = AI_MODELS.find(m => m.value === model);
  return modelOption?.description || '';
}

export function isDefaultModel(model: AIModel): boolean {
  const modelOption = AI_MODELS.find(m => m.value === model);
  return modelOption?.isDefault || false;
}
