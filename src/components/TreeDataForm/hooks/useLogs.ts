import { useState, useCallback, useRef } from 'react';
import type { LogEntry, NodeLogs } from '../types/logTypes';
import type { TreeNode } from '../types';

/**
 * 日志管理 Hook
 */
export const useLogs = () => {
  const [logs, setLogs] = useState<NodeLogs>({});
  const initialValuesRef = useRef<Record<string, Partial<TreeNode>>>({});

  /**
   * 记录初始值（编辑开始时）
   */
  const recordInitialValues = useCallback((nodeId: string, initialValue: Partial<TreeNode>) => {
    initialValuesRef.current[nodeId] = initialValue;
  }, []);

  /**
   * 记录字段变更
   */
  const logFieldChange = useCallback(
    (nodeId: string, fieldName: string, oldValue: string, newValue: string) => {
      if (oldValue === newValue) return;

      const logEntry: LogEntry = {
        id: `${nodeId}-${Date.now()}-${Math.random()}`,
        nodeId,
        fieldName,
        oldValue: String(oldValue || ''),
        newValue: String(newValue || ''),
        timestamp: Date.now(),
        action: 'update',
      };

      setLogs((prev) => {
        const nodeLogs = prev[nodeId] || [];
        return {
          ...prev,
          [nodeId]: [...nodeLogs, logEntry],
        };
      });
    },
    []
  );

  /**
   * 批量记录字段变更（对比初始值和当前值）
   */
  const logBatchChanges = useCallback(
    (nodeId: string, currentValues: Partial<TreeNode>) => {
      const initialValue = initialValuesRef.current[nodeId];
      if (!initialValue) return;

      // 对比所有字段，记录变更
      const fields: (keyof TreeNode)[] = [
        'name',
        'value1',
        'value2',
        'value3',
        'value4',
        'value5',
        'value6',
        'value7',
        'value8',
        'value9',
        'value10',
        'status',
      ];

      fields.forEach((field) => {
        const oldVal = initialValue[field];
        const newVal = currentValues[field];
        if (oldVal !== newVal) {
          logFieldChange(nodeId, field, String(oldVal || ''), String(newVal || ''));
        }
      });
    },
    [logFieldChange]
  );

  /**
   * 记录删除操作
   */
  const logDelete = useCallback((nodeId: string, nodeData: TreeNode) => {
    const logEntry: LogEntry = {
      id: `${nodeId}-${Date.now()}-${Math.random()}`,
      nodeId,
      fieldName: 'delete',
      oldValue: JSON.stringify(nodeData),
      newValue: '',
      timestamp: Date.now(),
      action: 'delete',
    };

    setLogs((prev) => {
      const nodeLogs = prev[nodeId] || [];
      return {
        ...prev,
        [nodeId]: [...nodeLogs, logEntry],
      };
    });
  }, []);

  /**
   * 获取节点的日志
   */
  const getNodeLogs = useCallback(
    (nodeId: string): LogEntry[] => {
      return logs[nodeId] || [];
    },
    [logs]
  );

  /**
   * 清空日志
   */
  const clearLogs = useCallback(() => {
    setLogs({});
    initialValuesRef.current = {};
  }, []);

  return {
    logs,
    recordInitialValues,
    logFieldChange,
    logBatchChanges,
    logDelete,
    getNodeLogs,
    clearLogs,
  };
};

