import { Form, Select } from 'antd';
import type { TreeNode } from '../../types';
import type { SelectProps } from 'antd';

interface SelectCellProps {
  record: TreeNode;
  fieldName: string;
  placeholder: string;
  requiredMessage: string;
  options: SelectProps['options'];
  onChange?: (value: string) => void;
}

/**
 * 选择框单元格组件
 */
export const SelectCell = ({
  record,
  fieldName,
  placeholder,
  requiredMessage,
  options,
  onChange,
}: SelectCellProps) => {
  return (
    <Form.Item
      name={[record.id, fieldName]}
      style={{ margin: 0 }}
      rules={[
        {
          required: true,
          message: requiredMessage,
        },
      ]}
    >
      <Select options={options} placeholder={placeholder} onChange={onChange} />
    </Form.Item>
  );
};

