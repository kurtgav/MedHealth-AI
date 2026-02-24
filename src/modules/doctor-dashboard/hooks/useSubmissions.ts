'use client';

import { useState, useEffect } from 'react';
import { fetchSubmissions, fetchSubmission } from '../services/submissionService';
import { Submission, SubmissionFilters, StatsOverview } from '../types';
import { SubmissionStatus } from '@prisma/client';

export function useSubmissions(filters?: SubmissionFilters) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSubmissions(filters);
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [filters]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubmissions(filters);
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh submissions');
    } finally {
      setLoading(false);
    }
  };

  const stats: StatsOverview = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === SubmissionStatus.NEW).length,
    inReview: submissions.filter((s) => s.status === SubmissionStatus.IN_REVIEW).length,
    completed: submissions.filter((s) => s.status === SubmissionStatus.COMPLETED).length,
  };

  return { submissions, loading, error, refresh, stats };
}

export function useSubmission(id: string | null) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setSubmission(null);
      setLoading(false);
      return;
    }

    async function loadSubmission() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSubmission(id as string);
        setSubmission(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submission');
      } finally {
        setLoading(false);
      }
    }

    loadSubmission();
  }, [id]);

  return { submission, loading, error };
}

