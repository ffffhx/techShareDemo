import { useRef, useCallback } from 'react';

/**
 * 跟踪编辑过的字段的 Hook
 */
export const useEditedFields = () => {
  // 使用 Set 存储编辑过的字段路径，格式: "nodeId.fieldName"
  const editedFieldsRef = useRef<Set<string>>(new Set());

  /**
   * 标记字段为已编辑
   */
  const markFieldAsEdited = useCallback((nodeId: string, fieldName: string) => {
    const fieldPath = `${nodeId}.${fieldName}`;
    editedFieldsRef.current.add(fieldPath);
  }, []);

  /**
   * 获取所有编辑过的字段路径（用于验证）
   * 返回格式: [[nodeId, fieldName], ...]
   */
  const getEditedFieldPaths = useCallback((): Array<[string, string]> => {
    return Array.from(editedFieldsRef.current).map((path) => {
      const [nodeId, fieldName] = path.split('.');
      return [nodeId, fieldName];
    });
  }, []);

  /**
   * 清空已编辑字段记录
   */
  const clearEditedFields = useCallback(() => {
    editedFieldsRef.current.clear();
  }, []);

  /**
   * 获取编辑过的字段数量
   */
  const getEditedFieldsCount = useCallback(() => {
    return editedFieldsRef.current.size;
  }, []);

  return {
    markFieldAsEdited,
    getEditedFieldPaths,
    clearEditedFields,
    getEditedFieldsCount,
  };
};


