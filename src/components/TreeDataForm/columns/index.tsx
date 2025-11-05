import type { TableColumnsType } from 'antd';
import type { TreeNode } from '../types';
import { createBaseColumns } from './base';
import { createStatusColumn } from './status';
import { createActionColumn } from './action';
import { createAvatarColumn } from './avatar';

interface ColumnsConfig {
  isEditing: boolean;
  onValue1Change: (nodeId: string, value1: string) => void;
  onDeleteRow: (nodeId: string) => void;
  onViewLogs: (nodeId: string) => void;
}

/**
 * 创建完整的列配置
 */
export const createColumns = ({
  isEditing,
  onValue1Change,
  onDeleteRow,
  onViewLogs,
}: ColumnsConfig): TableColumnsType<TreeNode> => {
  const baseColumns = createBaseColumns({ isEditing, onValue1Change });
  const statusColumn = createStatusColumn();
  const avatarColumn = createAvatarColumn();
  const actionColumn = createActionColumn({ isEditing, onDeleteRow, onViewLogs });

  // 操作列和头像列始终显示
  return [...baseColumns, statusColumn, actionColumn, avatarColumn];
};

