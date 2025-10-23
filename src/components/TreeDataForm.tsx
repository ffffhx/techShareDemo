import React, { useState, useCallback, createContext, useContext, useRef } from 'react';
import { Input, Button, Space, Typography, message, Table, Select } from 'antd';
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

// Context 类型定义
interface FormContextType {
  values: { [nodeId: string]: Partial<TreeNode> };
  updateValue: (nodeId: string, field: string, value: string) => void;
  getValue: (nodeId: string, field: string) => string;
  errors: { [key: string]: string }; // key 格式: nodeId-field
  setError: (nodeId: string, field: string, error: string) => void;
  clearError: (nodeId: string, field: string) => void;
  getError: (nodeId: string, field: string) => string;
  isEditing: boolean;
}

// 创建 Context
const FormContext = createContext<FormContextType | null>(null);

// 自定义 Hook 来使用 Context
const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

interface TreeDataFormProps {
  data: TreeNode[];
}


// Form Provider 组件
const FormProvider = ({ 
  children, 
  initialValues,
  onValueChange,
  contextRef,
  isEditing
}: { 
  children: React.ReactNode; 
  initialValues: { [nodeId: string]: Partial<TreeNode> };
  onValueChange?: (nodeId: string, field: string, value: string, updateValue: (nodeId: string, field: string, value: string) => void) => void;
  contextRef?: React.MutableRefObject<FormContextType | null>;
  isEditing: boolean;
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateValue = useCallback((nodeId: string, field: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [field]: value
      }
    }));
    
    // 调用外部联动逻辑，传入 updateValue 方法
    if (onValueChange) {
      onValueChange(nodeId, field, value, updateValue);
    }
  }, [onValueChange]);

  const getValue = useCallback((nodeId: string, field: string): string => {
    const value = values[nodeId]?.[field as keyof TreeNode];
    return typeof value === 'string' ? value : '';
  }, [values]);

  const setError = useCallback((nodeId: string, field: string, error: string) => {
    const key = `${nodeId}-${field}`;
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));
  }, []);

  const clearError = useCallback((nodeId: string, field: string) => {
    const key = `${nodeId}-${field}`;
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const getError = useCallback((nodeId: string, field: string): string => {
    const key = `${nodeId}-${field}`;
    return errors[key] || '';
  }, [errors]);

  const contextValue = { 
    values, 
    updateValue, 
    getValue, 
    errors, 
    setError, 
    clearError, 
    getError,
    isEditing 
  };
  
  // 将 context 值传递给 ref
  if (contextRef) {
    contextRef.current = contextValue;
  }

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(data);
  const [isEditing, setIsEditing] = useState(false);
  const contextRef = useRef<FormContextType | null>(null);

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

  // Context 值变化处理函数
  const handleContextValueChange = (nodeId: string, field: string, value: string, updateValue: (nodeId: string, field: string, value: string) => void) => {
    // 如果是值1变化，自动更新值2
    if (field === 'value1') {
      const linkedValue2 = getLinkedValue2(value);
      // 直接更新值2，避免循环调用
      setTimeout(() => {
        updateValue(nodeId, 'value2', linkedValue2);
      }, 0);
    }
  };

  const buildInitialValues = () => {
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
    return formValues;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // 从 Context 获取当前所有值
    if (!contextRef.current) {
      message.error('表单数据获取失败！');
      return;
    }
    
    const { values: currentValues, errors, setError } = contextRef.current;
    
    // 检查是否有现有错误
    if (Object.keys(errors).length > 0) {
      message.error('请先修正表单中的错误！');
      return;
    }
    
    // 检查所有字段是否为空
    let hasEmptyField = false;
    const checkEmptyFields = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        const nodeValues = currentValues[node.id];
        if (nodeValues) {
          // 检查所有字段
          const fields = ['name', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6', 'value7', 'value8', 'value9', 'value10'];
          fields.forEach((field) => {
            const value = nodeValues[field as keyof TreeNode];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              setError(node.id, field, '不允许为空');
              hasEmptyField = true;
            }
          });
        }
        if (node.children) {
          checkEmptyFields(node.children);
        }
      });
    };
    
    checkEmptyFields(treeData);
    
    if (hasEmptyField) {
      message.error('存在空字段，请填写完整后再保存！');
      return;
    }
    
    // 更新所有节点的数据
    const updateAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        const newNode = currentValues[node.id] ? { ...node, ...currentValues[node.id] } : node;
        if (newNode.children) {
          newNode.children = updateAllNodes(newNode.children);
        }
        return newNode;
      });
    };

    setTreeData(updateAllNodes(treeData));
    setIsEditing(false);
    message.success('保存成功！');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Context 会自动重置，因为重新渲染时会使用最新的 treeData
  };

  // 渲染可编辑单元格组件
  const EditableCell = ({ record, field, inputType = 'input', options }: {
    record: TreeNode;
    field: string;
    inputType?: 'input' | 'select';
    options?: Array<{ label: string; value: string }>;
  }) => {
    const { getValue, updateValue, getError, setError, clearError, isEditing } = useFormContext();
    const currentValue = getValue(record.id, field);
    const errorMessage = getError(record.id, field);

    if (!isEditing) {
      const value = currentValue || record[field as keyof TreeNode];
      return typeof value === 'string' ? value : '';
    }

    const handleChange = (value: string) => {
      updateValue(record.id, field, value);
      
      // 校验空值
      if (!value || value.trim() === '') {
        setError(record.id, field, '不允许为空');
      } else {
        clearError(record.id, field);
      }
    };

    if (inputType === 'select' && options) {
      return (
        <div>
          <Select
            value={currentValue}
            options={options}
            placeholder={`请选择${field}`}
            status={errorMessage ? 'error' : undefined}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          {errorMessage && (
            <div style={{ 
              color: '#ff4d4f', 
              fontSize: '12px', 
              marginTop: '4px',
              lineHeight: '1.5'
            }}>
              {errorMessage}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <Input
          value={currentValue}
          placeholder={`请输入${field}`}
          status={errorMessage ? 'error' : undefined}
          onChange={(e) => handleChange(e.target.value)}
        />
        {errorMessage && (
          <div style={{ 
            color: '#ff4d4f', 
            fontSize: '12px', 
            marginTop: '4px',
            lineHeight: '1.5'
          }}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  };

  // 渲染可编辑单元格
  const renderEditableCell = (record: TreeNode, field: string, inputType: 'input' | 'select' = 'input', options?: Array<{ label: string; value: string }>) => {
    return <EditableCell record={record} field={field} inputType={inputType} options={options} />;
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
      render: (_, record: TreeNode) => renderEditableCell(record, 'name', 'input'),
    },
    {
      title: '值1',
      dataIndex: 'value1',
      key: 'value1',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value1', 'select', selectOptions.value1),
    },
    {
      title: '值2',
      dataIndex: 'value2',
      key: 'value2',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value2', 'select', selectOptions.value2),
    },
    {
      title: '值3',
      dataIndex: 'value3',
      key: 'value3',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value3', 'select', selectOptions.value3),
    },
    {
      title: '值4',
      dataIndex: 'value4',
      key: 'value4',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value4', 'select', selectOptions.value4),
    },
    {
      title: '值5',
      dataIndex: 'value5',
      key: 'value5',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value5', 'select', selectOptions.value5),
    },
    {
      title: '值6',
      dataIndex: 'value6',
      key: 'value6',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value6', 'input'),
    },
    {
      title: '值7',
      dataIndex: 'value7',
      key: 'value7',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value7', 'input'),
    },
    {
      title: '值8',
      dataIndex: 'value8',
      key: 'value8',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value8', 'input'),
    },
    {
      title: '值9',
      dataIndex: 'value9',
      key: 'value9',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value9', 'input'),
    },
    {
      title: '值10',
      dataIndex: 'value10',
      key: 'value10',
      width: 120,
      render: (_, record: TreeNode) => renderEditableCell(record, 'value10', 'input'),
    },
  ];

  return (
    <div style={{ padding: 24, width: '100%' }}>
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

      <FormProvider 
        initialValues={buildInitialValues()}
        onValueChange={handleContextValueChange}
        contextRef={contextRef}
        isEditing={isEditing}
      >
        <Table
          columns={columns}
          dataSource={treeData}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1500 }}
          bordered
          defaultExpandAllRows
        />
      </FormProvider>
    </div>
  );
};

