import type { TreeNode } from '../types';

/**
 * 构建表单初始值
 */
export const buildFormValues = (treeData: TreeNode[]): { [key: string]: Partial<TreeNode> } => {
  const formValues: { [key: string]: Partial<TreeNode> } = {};

  const walk = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      formValues[node.id] = {
        name: node.name,
        value1: node.value1,
        value2: node.value2,
        value3: node.value3,
        value4: node.value4,
        value5: node.value5,
        value6: node.value6,
        value7: node.value7,
        value8: node.value8,
        value9: node.value9,
        value10: node.value10,
        status: node.status || 'pending',
      };

      if (node.children) {
        walk(node.children);
      }
    });
  };

  walk(treeData);
  return formValues;
};

