import { useCallback } from 'react';
import { useEventEmitter } from './useEventEmitter';
import type { FieldChangeEvent } from './useEventEmitter';

// 联动配置：定义字段间的联动关系
export const LINKAGE_CONFIG = {
  value1: {
    affects: ['value2'],  // value1 变化会影响 value2
  }
  // 未来如果有其他联动，可以继续添加
  // value3: { affects: ['value4'] }
};

// 自动计算需要监听事件的字段集合
export const FIELDS_NEED_LISTENER = new Set<string>();
Object.values(LINKAGE_CONFIG).forEach(config => {
  config.affects.forEach(field => FIELDS_NEED_LISTENER.add(field));
});

/**
 * 字段联动 Hook
 * 处理字段间的联动逻辑，如 value1 变化时自动更新 value2
 */
export const useFieldLinkage = (
  updateField: (nodeId: string, field: string, value: string) => void
) => {
  const { emit } = useEventEmitter();

  // 联动逻辑：根据值1的变化自动设置值2
  const getLinkedValue2 = useCallback((value1: string): string => {
    const linkMap: { [key: string]: string } = {
      '选项A1': '选项A2',
      '选项B1': '选项B2', 
      '选项C1': '选项C2',
      '选项D1': '选项D2',
      '选项E1': '选项E2',
    };
    return linkMap[value1] || '选项A2';
  }, []);

  // 处理字段变化事件，执行联动逻辑
  const handleFieldChange = useCallback((event: FieldChangeEvent) => {
    const { nodeId, field, value } = event;
    
    // 1. 更新草稿本中的数据
    updateField(nodeId, field, value);
    
    // 2. 检查联动逻辑：根据 LINKAGE_CONFIG 处理联动
    const linkageConfig = LINKAGE_CONFIG[field as keyof typeof LINKAGE_CONFIG];
    if (linkageConfig) {
      // 如果是值1变化，自动更新值2
      if (field === 'value1') {
        const linkedValue2 = getLinkedValue2(value);
        
        // 更新草稿本中的值2
        updateField(nodeId, 'value2', linkedValue2);
        
        // 通过事件通知值2的单元格更新显示
        setTimeout(() => {
          emit('fieldChange', {
            nodeId,
            field: 'value2',
            value: linkedValue2
          });
        }, 0);
      }
    }
  }, [updateField, getLinkedValue2, emit]);

  return {
    handleFieldChange,
  };
};

