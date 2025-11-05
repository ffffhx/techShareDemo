import type { FormInstance } from 'antd/es/form';
import type { TreeNode } from '../types';

/**
 * 管理表单值的构建和设置
 */
export const useFormValues = (form: FormInstance) => {
  const buildFormValues = (treeData: TreeNode[]): { [key: string]: Partial<TreeNode> } => {
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

  const setFormValues = (treeData: TreeNode[]) => {
    const formValues = buildFormValues(treeData);
    form.setFieldsValue(formValues);
  };

  return {
    buildFormValues,
    setFormValues,
  };
};

