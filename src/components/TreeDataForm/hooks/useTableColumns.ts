import { useMemo, useCallback } from 'react';
import type { FormInstance } from 'antd/es/form';
import { getLinkedValue2 } from '../constants';
import { createColumns } from '../columns';

interface UseTableColumnsProps {
  isEditing: boolean;
  form: FormInstance;
  onDeleteRow: (nodeId: string) => void;
  onViewLogs: (nodeId: string) => void;
}

/**
 * 管理表格列配置的生成
 */
export const useTableColumns = ({ isEditing, form, onDeleteRow, onViewLogs }: UseTableColumnsProps) => {
  // 处理值1变化时的联动逻辑
  const handleValue1Change = useCallback(
    (nodeId: string, value1: string) => {
      const linkedValue2 = getLinkedValue2(value1);
      // 更新表单中对应行的值
      form.setFieldValue([nodeId, 'value2'], linkedValue2);
    },
    [form]
  );

  // 生成列配置
  const columns = useMemo(
    () =>
      createColumns({
        isEditing,
        onValue1Change: handleValue1Change,
        onDeleteRow,
        onViewLogs,
      }),
    [isEditing, handleValue1Change, onDeleteRow, onViewLogs]
  );

  return columns;
};

