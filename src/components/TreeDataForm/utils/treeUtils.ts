import type { TreeNode } from '../types';

/**
 * 删除节点（及其子节点）
 */
export const removeNodeById = (nodes: TreeNode[], targetId: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => {
      if (node.children && node.children.length) {
        return { ...node, children: removeNodeById(node.children, targetId) };
      }
      return node;
    });
};

/**
 * 更新所有节点的数据
 */
export const updateAllNodes = (
  nodes: TreeNode[],
  values: { [key: string]: Partial<TreeNode> }
): TreeNode[] => {
  return nodes.map((node) => {
    const newNode = values[node.id] ? { ...node, ...values[node.id] } : node;
    if (newNode.children) {
      newNode.children = updateAllNodes(newNode.children, values);
    }
    return newNode;
  });
};

/**
 * 扁平化树形数据
 */
export const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
  const result: TreeNode[] = [];
  const walk = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      const { children, ...rest } = node;
      result.push({ ...rest, children: undefined });
      if (children && children.length) {
        walk(children);
      }
    });
  };
  walk(nodes);
  return result;
};

