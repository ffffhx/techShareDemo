import { Tag, Popover, Space, Typography } from 'antd';
import { statusColorMap } from '../../constants';
import type { TreeNode } from '../../types';

const { Text } = Typography;

interface StatusCellProps {
  record: TreeNode;
}

const StatusPopoverContent = () => {
  return (
    <Space direction="vertical" size={4}>
      <Space size={8}>
        <Tag color={statusColorMap['approved']}>approved</Tag>
        <Text>已审批</Text>
      </Space>
      <Space size={8}>
        <Tag color={statusColorMap['pending']}>pending</Tag>
        <Text>待处理</Text>
      </Space>
      <Space size={8}>
        <Tag color={statusColorMap['successed']}>successed</Tag>
        <Text>成功</Text>
      </Space>
      <Space size={8}>
        <Tag color={statusColorMap['Failed']}>Failed</Tag>
        <Text>失败</Text>
      </Space>
    </Space>
  );
};

export const StatusCell = ({ record }: StatusCellProps) => {
  const status = record.status || 'pending';
  return (
    <Popover content={<StatusPopoverContent />} title="状态说明" trigger="hover">
      <Tag color={statusColorMap[status]}>{status}</Tag>
    </Popover>
  );
};

