import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Space, Typography, message, Table, Select } from 'antd';
import type { TableColumnsType } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const { Text } = Typography;

export interface TreeNode {
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

const flattenTree = (tree: TreeNode[]): TreeNode[] => {
  let result: TreeNode[] = [];
  for (const node of tree) {
    const { children, ...rest } = node;
    result.push(rest as TreeNode);
    if (children) {
      result = result.concat(flattenTree(children));
    }
  }
  return result;
};

const unflattenTree = (flatData: TreeNode[], originalTree: TreeNode[]): TreeNode[] => {
  const dataMap = new Map(flatData.map(item => [item.id, { ...item, children: [] }]));

  const buildTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map(node => {
      const updatedNode = dataMap.get(node.id)!;
      if (node.children) {
        updatedNode.children = buildTree(node.children);
      }
      return updatedNode;
    });
  };

  return buildTree(originalTree);
};

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>(data);

  const flatData = useMemo(() => flattenTree(data), [data]);

  const { control, handleSubmit, reset } = useForm<{ nodes: TreeNode[] }>({
    defaultValues: { nodes: flatData },
  });

  const { fields } = useFieldArray({ control, name: 'nodes' });

  useEffect(() => {
    setTreeData(data);
    reset({ nodes: flattenTree(data) });
  }, [data, reset]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    reset({ nodes: flatData });
    setIsEditing(false);
  };

  const onSubmit = (formData: { nodes: TreeNode[] }) => {
    const newTreeData = unflattenTree(formData.nodes, data);
    setTreeData(newTreeData);
    setIsEditing(false);
    message.success('保存成功！');
  };

  const onError = () => {
    message.error('请填写所有必填项！存在空白输入框');
  };

  const selectOptions = {
    value1: [{ label: '选项A1', value: '选项A1' }, { label: '选项B1', value: '选项B1' }],
    value2: [{ label: '选项A2', value: '选项A2' }, { label: '选项B2', value: '选项B2' }],
    value3: [{ label: '选项A3', value: '选项A3' }, { label: '选项B3', value: '选项B3' }],
    value4: [{ label: '选项A4', value: '选项A4' }, { label: '选项B4', value: '选项B4' }],
    value5: [{ label: '选项A5', value: '选项A5' }, { label: '选项B5', value: '选项B5' }],
  };

  const columns: TableColumnsType<TreeNode> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 180, fixed: 'left' },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      render: (_: string, record: TreeNode, index: number) => isEditing ? (
        <Controller
          name={`nodes.${index}.name`}
          control={control}
          rules={{ required: '名称不能为空' }}
          render={({ field, fieldState }) => (
            <div>
              <Input 
                {...field} 
                placeholder="请输入名称" 
                status={fieldState.error ? 'error' : ''} 
              />
              {fieldState.error && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', lineHeight: '1.5', marginTop: '4px' }}>
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />
      ) : record.name,
    },
    ...Object.keys(selectOptions).map((key, i) => ({
      title: `值${i + 1}`,
      dataIndex: key,
      key: key,
      width: 120,
      render: (_: string, record: TreeNode, index: number) => isEditing ? (
        <Controller
          name={`nodes.${index}.${key}` as const}
          control={control}
          rules={{ required: `值${i + 1}不能为空` }}
          render={({ field, fieldState }) => (
            <div>
              <Select 
                {...field} 
                options={selectOptions[key as keyof typeof selectOptions]} 
                placeholder={`请选择值${i + 1}`} 
                style={{ width: '100%' }} 
                status={fieldState.error ? 'error' : ''}
              />
              {fieldState.error && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', lineHeight: '1.5', marginTop: '4px' }}>
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />
      ) : record[key as keyof TreeNode],
    })),
    ...[6, 7, 8, 9, 10].map(i => ({
      title: `值${i}`,
      dataIndex: `value${i}`,
      key: `value${i}`,
      width: 120,
      render: (_: string, record: TreeNode, index: number) => isEditing ? (
        <Controller
          name={`nodes.${index}.value${i}` as const}
          control={control}
          rules={{ required: `值${i}不能为空` }}
          render={({ field, fieldState }) => (
            <div>
              <Input 
                {...field} 
                placeholder={`请输入值${i}`} 
                status={fieldState.error ? 'error' : ''} 
              />
              {fieldState.error && (
                <div style={{ color: '#ff4d4f', fontSize: '12px', lineHeight: '1.5', marginTop: '4px' }}>
                  {fieldState.error.message}
                </div>
              )}
            </div>
          )}
        />
      ) : record[`value${i}` as keyof TreeNode],
    }))
  ];

  return (
    <div style={{ padding: 24, width: '100%' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>树形数据表单</Typography.Title>
          <Text type="secondary">
            {isEditing
              ? '编辑模式：可以修改所有字段，点击"保存"保存所有修改'
              : '查看模式：使用表格展示数据，点击"编辑"进入编辑态'}
          </Text>
        </div>
        <Space>
          {!isEditing ? (
            <Button type="primary" size="large" icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
          ) : (
            <>
              <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSubmit(onSubmit, onError)}>
                保存
              </Button>
              <Button size="large" icon={<CloseOutlined />} onClick={handleCancel}>
                取消
              </Button>
            </>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={isEditing ? fields : treeData}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1500 }}
        bordered
        defaultExpandAllRows
      />
    </div>
  );
};