import { AuditLogEntry } from '../types';

const AUDIT_KEY = 'medhelp-audit-log';

function readLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(AUDIT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuditLogEntry[];
  } catch (error) {
    console.warn('Failed to parse audit log', error);
    return [];
  }
}

function writeLogs(entries: AuditLogEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUDIT_KEY, JSON.stringify(entries));
}

export function logClinicalAction(entry: AuditLogEntry): AuditLogEntry[] {
  const logs = readLogs();
  logs.push(entry);
  writeLogs(logs);
  return logs;
}

export function getAuditLogs(): AuditLogEntry[] {
  return readLogs();
}
