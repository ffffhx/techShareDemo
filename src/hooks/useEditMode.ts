import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * 编辑模式 Hook
 * 管理编辑模式的状态和操作
 */
export const useEditMode = (
  onEnterEdit?: () => void,
  onExitEdit?: () => void
) => {
  const [isEditing, setIsEditing] = useState(false);

  const enterEditMode = useCallback(() => {
    setIsEditing(true);
    onEnterEdit?.();
    message.success('已进入编辑模式，所有单元格已变为可编辑状态');
  }, [onEnterEdit]);

  const exitEditMode = useCallback(() => {
    setIsEditing(false);
    onExitEdit?.();
  }, [onExitEdit]);

  const save = useCallback(() => {
    setIsEditing(false);
    onExitEdit?.();
    message.success('保存成功！');
  }, [onExitEdit]);

  const cancel = useCallback(() => {
    setIsEditing(false);
    onExitEdit?.();
  }, [onExitEdit]);

  return {
    isEditing,
    enterEditMode,
    exitEditMode,
    save,
    cancel,
  };
};

