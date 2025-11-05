/**
 * 日志条目
 */
export interface LogEntry {
  id: string;
  nodeId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  timestamp: number;
  action: 'update' | 'delete' | 'create';
}

/**
 * 节点日志（按节点ID索引）
 */
export type NodeLogs = Record<string, LogEntry[]>;

