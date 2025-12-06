'use client';

import { useState } from 'react';

import { AIAnalysisProgress, AIResponse, AIAnalysisRequest, ValidationResult } from '../types';
import { analyzePatient } from '../services/aiClient';
import { validateInteractions, getKnownInteractions } from '../services/drugDatabase.service';

const initialProgress: AIAnalysisProgress = { step: 'idle' };

export function useAIAnalysis() {
  const [progress, setProgress] = useState<AIAnalysisProgress>(initialProgress);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startAnalysis = async (payload: AIAnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setValidation(null);
    setProgress({ step: 'preparing', message: 'Preparing intake payload...' });

    try {
      setProgress({ step: 'analyzing-medications', message: 'Checking medications and vitals...' });
      const aiResponse = await analyzePatient(payload);
      setProgress({ step: 'validating', message: 'Validating safety rules...' });
      const db = getKnownInteractions();
      const validationResult = validateInteractions(aiResponse, payload.patientData.medications, db);
      setValidation(validationResult);
      setResponse(aiResponse);
      setProgress({ step: 'completed', message: 'Analysis complete' });
    } catch (err) {
      console.error('AI analysis failed', err);
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setProgress({ step: 'error', message: 'Analysis failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setProgress(initialProgress);
    setResponse(null);
    setValidation(null);
    setError(null);
  };

  return {
    startAnalysis,
    progress,
    response,
    validation,
    error,
    isLoading,
    reset,
  };
}
