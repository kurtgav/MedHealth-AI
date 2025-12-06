import { RiskLevel } from '../types';
import { colors } from '../constants/theme';

export function formatRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW':
      return '#22c55e';
    case 'MEDIUM':
      return '#f59e0b';
    case 'HIGH':
      return '#f97316';
    case 'CRITICAL':
      return '#ef4444';
    default:
      return colors.secondary;
  }
}

export function formatPercent(value: number): string {
  return `${Math.min(100, Math.max(0, Number(value.toFixed(0))))}%`;
}
