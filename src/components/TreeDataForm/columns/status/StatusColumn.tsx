import type { TableColumnsType } from 'antd';
import type { TreeNode } from '../../types';
import { StatusCell } from '../../cells/display/StatusCell';

/**
 * 状态列配置
 */
export const createStatusColumn = (): TableColumnsType<TreeNode>[number] => {
  return {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (_text: TreeNode['status'], record: TreeNode) => {
      return <StatusCell record={record} />;
    },
  };
};

