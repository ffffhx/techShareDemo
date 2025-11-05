import { Form, Input } from 'antd';
import type { TreeNode } from '../../types';

interface InputCellProps {
  record: TreeNode;
  fieldName: string;
  placeholder: string;
  requiredMessage: string;
}

/**
 * 输入框单元格组件
 */
export const InputCell = ({ record, fieldName, placeholder, requiredMessage }: InputCellProps) => {
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
      <Input placeholder={placeholder} />
    </Form.Item>
  );
};

