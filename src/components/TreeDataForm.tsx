import { useState } from 'react';
import { Form, Input, Button, Space, Typography, message, Table, Select } from 'antd';
import type { TableColumnsType } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TreeNode {
  id: string;
  name: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  value7: string;
  value8: string;
  value9: string;
  value10: string;
  children?: TreeNode[];
}


interface TreeDataFormProps {
  data: TreeNode[];
}

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Mock 选择框选项
  const selectOptions = {
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

  // 联动逻辑：根据值1的变化自动设置值2
  const getLinkedValue2 = (value1: string): string => {
    const linkMap: { [key: string]: string } = {
      '选项A1': '选项A2',
      '选项B1': '选项B2', 
      '选项C1': '选项C2',
      '选项D1': '选项D2',
      '选项E1': '选项E2',
    };
    return linkMap[value1] || '选项A2';
  };

  // 处理值1变化时的联动逻辑
  const handleValue1Change = (nodeId: string, value1: string) => {
    const linkedValue2 = getLinkedValue2(value1);
    
    // 更新表单中对应行的值
    form.setFieldValue([nodeId, 'value2'], linkedValue2);
  };

  const handleEdit = () => {
    // 构建表单初始值，以 nodeId 为键
    const formValues: { [key: string]: Partial<TreeNode> } = {};
    
    const buildFormValues = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        formValues[node.id] = {
          name: node.name,
          value1: node.value1,
          value2: node.value2,
          value3: node.value3,
          value4: node.value4,
          value5: node.value5,
          value6: node.value6,
          value7: node.value7,
          value8: node.value8,
          value9: node.value9,
          value10: node.value10,
        };
        
        if (node.children) {
          buildFormValues(node.children);
        }
      });
    };
    
    buildFormValues(treeData);
    
    // 设置表单初始值
    form.setFieldsValue(formValues);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();
      
      // 更新所有节点的数据
      const updateAllNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          const newNode = values[node.id] ? { ...node, ...values[node.id] } : node;
          if (newNode.children) {
            newNode.children = updateAllNodes(newNode.children);
          }
          return newNode;
        });
      };

      setTreeData(updateAllNodes(treeData));
      setIsEditing(false);
      message.success('保存成功！');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('表单验证失败，请检查输入！');
    }
  };

  const handleCancel = () => {
    // 重置表单
    form.resetFields();
    setIsEditing(false);
  };

  // Table 列定义
  const columns: TableColumnsType<TreeNode> = [
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
                onChange={(value) => handleValue1Change(record.id, value)}
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
              <Select 
                options={selectOptions.value2}
                placeholder="请选择值2"
              />
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
              <Select 
                options={selectOptions.value3}
                placeholder="请选择值3"
              />
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
              <Select 
                options={selectOptions.value4}
                placeholder="请选择值4"
              />
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
              <Select 
                options={selectOptions.value5}
                placeholder="请选择值5"
              />
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


  return (
    <div style={{ padding: 24 ,width: '100%'}}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>树形数据表单</Typography.Title>
          <Text type="secondary">
            {isEditing 
              ? '编辑模式：可以修改所有字段，点击"保存"保存所有修改' 
              : '查看模式：使用表格展示数据，点击"编辑"进入编辑态'
            }
          </Text>
        </div>
        <Space>
          {!isEditing ? (
            <Button type="primary" size="large" icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
          ) : (
            <>
              <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave}>
                保存
              </Button>
              <Button size="large" icon={<CloseOutlined />} onClick={handleCancel}>
                取消
              </Button>
            </>
          )}
        </Space>
      </div>

      <Form form={form} component={false}>
        <Table
          columns={columns}
          dataSource={treeData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1500 }}
          bordered
          defaultExpandAllRows
        />
      </Form>
    </div>
  );
};

