import { Button, Space } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { TreeNode } from '../../types';

interface ActionColumnProps {
  isEditing: boolean;
  onDeleteRow: (nodeId: string) => void;
  onViewLogs: (nodeId: string) => void;
}

/**
 * 操作列配置（删除按钮、查看日志按钮）
 */
export const createActionColumn = ({
  isEditing,
  onDeleteRow,
  onViewLogs,
}: ActionColumnProps): TableColumnsType<TreeNode>[number] => {
  return {
    title: '操作',
    key: 'actions',
    width: 180,
    fixed: 'right' as const,
    render: (_: unknown, record: TreeNode) => {
      return (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => onViewLogs(record.id)}
          >
            日志
          </Button>
          {isEditing && (
            <Button danger size="small" onClick={() => onDeleteRow(record.id)}>
              删除
            </Button>
          )}
        </Space>
      );
    },
  };
};

