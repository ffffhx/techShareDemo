import { useState, useMemo } from 'react';
import type { TreeNode } from '../types';

/**
 * 管理树形数据的状态和扁平化
 */
export const useTreeData = (initialData: TreeNode[]) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  // 扁平化：用于编辑态展示为 List
  const listData = useMemo<TreeNode[]>(() => {
    const result: TreeNode[] = [];
    const walk = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        // 去掉 children，避免 antd Table 识别为树
        const { children, ...rest } = node;
        result.push({ ...rest, children: undefined });
        if (children && children.length) {
          walk(children);
        }
      });
    };
    walk(treeData);
    return result;
  }, [treeData]);

  return {
    treeData,
    setTreeData,
    listData,
  };
};

