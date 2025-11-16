import { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import { useFieldValidation } from './useFieldValidation';
import { useEventEmitter } from './useEventEmitter';
import type { FieldChangeEvent } from './useEventEmitter';
import { FIELDS_NEED_LISTENER } from './useFieldLinkage';

interface UseEditableFieldOptions {
  nodeId: string;
  field: string;
  value: string;
  editing: boolean;
  inputType?: 'input' | 'select';
  onValidate?: (value: string) => boolean;
}

/**
 * 可编辑字段 Hook
 * 管理可编辑字段的状态、验证、事件监听和可视化懒加载
 */
export const useEditableField = ({
  nodeId,
  field,
  value,
  editing,
  inputType = 'input',
  onValidate,
}: UseEditableFieldOptions) => {
  const [localValue, setLocalValue] = useState<string>(value);
  const { emit, on, off } = useEventEmitter();
  const { error, validate, clearError } = useFieldValidation(inputType);
  
  // 判断当前字段是否需要监听事件（会被其他字段联动影响）
  const needsListener = FIELDS_NEED_LISTENER.has(field);

  // 可视化懒加载
  const {
    isVisible,
    elementRef,
    reset: resetVisibility,
  } = useIntersectionObserver({
    enabled: editing,
  });

  // 监听字段变化事件（只有被联动影响的字段才需要）
  const handleFieldChange = useCallback((event: FieldChangeEvent) => {
    // 只处理针对当前节点当前字段的更新
    if (event.nodeId === nodeId && event.field === field) {
      setLocalValue(event.value);
    }
  }, [nodeId, field]);

  // 注册事件监听器 - 只有会被联动影响的字段才监听
  useEffect(() => {
    if (isVisible && needsListener) {
      on('fieldChange', handleFieldChange);
      return () => {
        off('fieldChange', handleFieldChange);
      };
    }
  }, [isVisible, needsListener, handleFieldChange, on, off]);

  // 当进入编辑模式且元素可见时，初始化值和验证
  useEffect(() => {
    if (editing && isVisible) {
      // 模拟加载延迟，让用户看到加载效果
      const timer = setTimeout(() => {
        setLocalValue(value);
        // 进入编辑模式时验证初始值
        if (onValidate) {
          onValidate(value);
        } else {
          validate(value);
        }
      }, Math.random() * 500 + 100); // 100-600ms的随机延迟

      return () => clearTimeout(timer);
    }
  }, [editing, isVisible, value, validate, onValidate]);

  // 重置可视化状态和错误信息
  useEffect(() => {
    if (!editing) {
      resetVisibility();
      clearError();
      setLocalValue(value);
    }
  }, [editing, value, resetVisibility, clearError]);

  // 处理字段值变化
  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    
    // 验证
    if (onValidate) {
      onValidate(newValue);
    } else {
      validate(newValue);
    }
    
    // 发送字段变化事件
    emit('fieldChange', {
      nodeId,
      field,
      value: newValue,
    });
  }, [nodeId, field, validate, onValidate, emit]);

  return {
    localValue,
    error,
    isVisible,
    elementRef,
    handleChange,
  };
};

