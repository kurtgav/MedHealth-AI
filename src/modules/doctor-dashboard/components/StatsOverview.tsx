'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsOverview as StatsOverviewType } from '../types';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  stats: StatsOverviewType;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Submissions</CardTitle>
          <FileText className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">New</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">{stats.new}</div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">In Review</CardTitle>
          <Clock className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{stats.inReview}</div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
        </CardContent>
      </Card>
    </div>
  );
}



