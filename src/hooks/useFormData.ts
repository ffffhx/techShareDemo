import { useRef, useCallback } from 'react';

export interface TreeNode {
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
  children?: TreeNode[];
}

/**
 * 表单数据管理 Hook
 * 管理表单的草稿本数据，支持初始化、更新和获取
 */
export const useFormData = (treeData: TreeNode[]) => {
  // 草稿本：存储所有字段的编辑数据
  const formDataRef = useRef<{ [nodeId: string]: Partial<TreeNode> }>({});

  // 初始化表单数据
  const initializeFormData = useCallback(() => {
    const formData: { [nodeId: string]: Partial<TreeNode> } = {};
    
    const buildFormData = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        formData[node.id] = {
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
        };
        
        if (node.children) {
          buildFormData(node.children);
        }
      });
    };
    
    buildFormData(treeData);
    formDataRef.current = formData;
  }, [treeData]);

  // 更新字段值
  const updateField = useCallback((nodeId: string, field: string, value: string) => {
    if (!formDataRef.current[nodeId]) {
      formDataRef.current[nodeId] = {};
    }
    (formDataRef.current[nodeId] as Record<string, string>)[field] = value;
  }, []);

  // 获取表单数据
  const getFormData = useCallback(() => {
    return formDataRef.current;
  }, []);

  // 验证所有必填字段
  const validateForm = useCallback(() => {
    const currentValues = formDataRef.current;
    let hasError = false;
    const errorFields: string[] = [];
    
    const checkNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        const draftData = currentValues[node.id] || {};
        // 检查所有输入框类型的字段（value6-value10）
        ['name', 'value6', 'value7', 'value8', 'value9', 'value10'].forEach(field => {
          // 优先使用草稿本中的值，如果草稿本中有该字段，即使是空字符串也使用它
          const value = field in draftData 
            ? (draftData[field as keyof TreeNode] as string)
            : (node[field as keyof TreeNode] as string);
          
          if (typeof value === 'string' && !value.trim()) {
            hasError = true;
            errorFields.push(`${node.id}-${field}`);
            console.log(`验证失败: 节点 ${node.id}, 字段 ${field}, 值: "${value}"`);
          }
        });
        if (node.children) {
          checkNodes(node.children);
        }
      });
    };
    
    checkNodes(treeData);
    
    return { hasError, errorFields };
  }, [treeData]);

  // 应用表单数据到树形数据
  const applyFormData = useCallback((nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      const newNode = formDataRef.current[node.id] 
        ? { ...node, ...formDataRef.current[node.id] } 
        : node;
      if (newNode.children) {
        newNode.children = applyFormData(newNode.children);
      }
      return newNode;
    });
  }, []);

  return {
    initializeFormData,
    updateField,
    getFormData,
    validateForm,
    applyFormData,
  };
};

