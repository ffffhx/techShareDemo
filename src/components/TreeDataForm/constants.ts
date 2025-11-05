import type { TreeNode } from './types';

// Mock 选择框选项
export const selectOptions = {
  value1: [
    { label: '选项A1', value: '选项A1' },
    { label: '选项B1', value: '选项B1' },
    { label: '选项C1', value: '选项C1' },
    { label: '选项D1', value: '选项D1' },
    { label: '选项E1', value: '选项E1' },
  ],
  value2: [
    { label: '选项A2', value: '选项A2' },
    { label: '选项B2', value: '选项B2' },
    { label: '选项C2', value: '选项C2' },
    { label: '选项D2', value: '选项D2' },
    { label: '选项E2', value: '选项E2' },
  ],
  value3: [
    { label: '选项A3', value: '选项A3' },
    { label: '选项B3', value: '选项B3' },
    { label: '选项C3', value: '选项C3' },
    { label: '选项D3', value: '选项D3' },
    { label: '选项E3', value: '选项E3' },
  ],
  value4: [
    { label: '选项A4', value: '选项A4' },
    { label: '选项B4', value: '选项B4' },
    { label: '选项C4', value: '选项C4' },
    { label: '选项D4', value: '选项D4' },
    { label: '选项E4', value: '选项E4' },
  ],
  value5: [
    { label: '选项A5', value: '选项A5' },
    { label: '选项B5', value: '选项B5' },
    { label: '选项C5', value: '选项C5' },
    { label: '选项D5', value: '选项D5' },
    { label: '选项E5', value: '选项E5' },
  ],
};

// 状态颜色映射
export const statusColorMap: Record<NonNullable<TreeNode['status']>, string> = {
  approved: 'green',
  pending: 'gold',
  successed: 'blue',
  Failed: 'red',
};

// 联动逻辑：根据值1的变化自动设置值2
export const getLinkedValue2 = (value1: string): string => {
  const linkMap: { [key: string]: string } = {
    '选项A1': '选项A2',
    '选项B1': '选项B2',
    '选项C1': '选项C2',
    '选项D1': '选项D2',
    '选项E1': '选项E2',
  };
  return linkMap[value1] || '选项A2';
};

