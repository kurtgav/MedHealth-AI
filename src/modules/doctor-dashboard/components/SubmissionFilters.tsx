'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SubmissionFilters as SubmissionFiltersType } from '../types';
import { SubmissionStatus } from '@prisma/client';
import { Search, Filter } from 'lucide-react';

interface SubmissionFiltersProps {
  filters: SubmissionFiltersType;
  onFiltersChange: (filters: SubmissionFiltersType) => void;
}

export function SubmissionFilters({ filters, onFiltersChange }: SubmissionFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? null : (status as SubmissionStatus),
    });
  };

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      search: search || null,
    });
  };

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({
      status: null,
      patientId: null,
      dateFrom: null,
      dateTo: null,
      search: null,
    });
  };

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by patient name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 border-white/20 bg-white/5 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[180px] border-white/20 bg-white/5 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={SubmissionStatus.NEW}>New</SelectItem>
              <SelectItem value={SubmissionStatus.IN_REVIEW}>In Review</SelectItem>
              <SelectItem value={SubmissionStatus.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>

          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



