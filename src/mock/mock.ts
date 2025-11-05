interface TreeNode {
  id: string;
  name: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  value7: string;
  value8: string;
  value9: string;
  value10: string;
  children?: TreeNode[]; // ✅ 这里加上 children
}

function generateTreeData(level = 1, maxLevel = 3, rowsPerLevel = 2): TreeNode[] {
  const result: TreeNode[] = [];

  for (let i = 0; i < rowsPerLevel; i++) {
    const node: TreeNode = {
      id: `${level}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      name: `节点-${level}-${i}`,
      value1: `值${Math.random().toString(36).slice(2, 5)}`,
      value2: `值${Math.random().toString(36).slice(2, 5)}`,
      value3: `值${Math.random().toString(36).slice(2, 5)}`,
      value4: `值${Math.random().toString(36).slice(2, 5)}`,
      value5: `值${Math.random().toString(36).slice(2, 5)}`,
      value6: `值${Math.random().toString(36).slice(2, 5)}`,
      value7: `值${Math.random().toString(36).slice(2, 5)}`,
      value8: `值${Math.random().toString(36).slice(2, 5)}`,
      value9: `值${Math.random().toString(36).slice(2, 5)}`,
      value10: `值${Math.random().toString(36).slice(2, 5)}`
    };

    if (level < maxLevel) {
      node.children = generateTreeData(level + 1, maxLevel, rowsPerLevel);
    }

    result.push(node);
  }

  return result;
}

export const mock = {
  code: 0,
  message: "success",
  data: generateTreeData(1, 3, 5)
};
