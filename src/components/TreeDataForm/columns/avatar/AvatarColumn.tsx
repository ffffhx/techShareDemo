import type { TableColumnsType } from 'antd';
import type { TreeNode } from '../../types';
import { AvatarCell } from '../../cells/display';

/**
 * 头像列配置
 */
export const createAvatarColumn = (): TableColumnsType<TreeNode>[number] => {
  return {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: () => <AvatarCell />,
  };
};

