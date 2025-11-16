import { useState, useCallback } from 'react';

type InputType = 'input' | 'select';

/**
 * 字段验证 Hook
 * 处理字段的验证逻辑和错误状态
 */
export const useFieldValidation = (inputType: InputType = 'input') => {
  const [error, setError] = useState<string>('');

  // 验证函数
  const validate = useCallback((val: string) => {
    if (inputType === 'input' && !val.trim()) {
      setError('该输入框不允许为空');
      return false;
    }
    setError('');
    return true;
  }, [inputType]);

  // 清除错误
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    error,
    validate,
    clearError,
  };
};

