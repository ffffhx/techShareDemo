import { Form, Input, Select } from 'antd';
import type { TableColumnsType } from 'antd';
import type { TreeNode } from '../../types';
import { selectOptions } from '../../constants';

interface BaseColumnsProps {
  isEditing: boolean;
  onValue1Change: (nodeId: string, value1: string) => void;
}

/**
 * 基础列配置（ID、名称、值1-值10）
 */
export const createBaseColumns = ({
  isEditing,
  onValue1Change,
}: BaseColumnsProps): TableColumnsType<TreeNode> => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'name']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入名称!',
                },
              ]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值1',
      dataIndex: 'value1',
      key: 'value1',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value1']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请选择值1!',
                },
              ]}
            >
              <Select
                options={selectOptions.value1}
                placeholder="请选择值1"
                onChange={(value) => onValue1Change(record.id, value)}
              />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值2',
      dataIndex: 'value2',
      key: 'value2',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value2']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请选择值2!',
                },
              ]}
            >
              <Select options={selectOptions.value2} placeholder="请选择值2" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值3',
      dataIndex: 'value3',
      key: 'value3',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value3']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请选择值3!',
                },
              ]}
            >
              <Select options={selectOptions.value3} placeholder="请选择值3" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值4',
      dataIndex: 'value4',
      key: 'value4',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value4']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请选择值4!',
                },
              ]}
            >
              <Select options={selectOptions.value4} placeholder="请选择值4" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值5',
      dataIndex: 'value5',
      key: 'value5',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value5']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请选择值5!',
                },
              ]}
            >
              <Select options={selectOptions.value5} placeholder="请选择值5" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值6',
      dataIndex: 'value6',
      key: 'value6',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value6']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入值6!',
                },
              ]}
            >
              <Input placeholder="请输入值6" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值7',
      dataIndex: 'value7',
      key: 'value7',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value7']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入值7!',
                },
              ]}
            >
              <Input placeholder="请输入值7" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值8',
      dataIndex: 'value8',
      key: 'value8',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value8']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入值8!',
                },
              ]}
            >
              <Input placeholder="请输入值8" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值9',
      dataIndex: 'value9',
      key: 'value9',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value9']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入值9!',
                },
              ]}
            >
              <Input placeholder="请输入值9" />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: '值10',
      dataIndex: 'value10',
      key: 'value10',
      width: 120,
      render: (text: string, record: TreeNode) => {
        if (isEditing) {
          return (
            <Form.Item
              name={[record.id, 'value10']}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入值10!',
                },
              ]}
            >
              <Input placeholder="请输入值10" />
            </Form.Item>
          );
        }
        return text;
      },
    },
  ];
};

