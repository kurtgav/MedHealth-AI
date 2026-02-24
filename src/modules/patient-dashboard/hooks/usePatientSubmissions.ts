'use client';

import { useState, useEffect } from 'react';
import { fetchPatientSubmissions } from '../services/submissionService';
import { Submission } from '../types';

export function usePatientSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPatientSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPatientSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh submissions');
    } finally {
      setLoading(false);
    }
  };

  return { submissions, loading, error, refresh };
}



