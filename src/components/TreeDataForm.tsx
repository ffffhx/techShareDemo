import { useState, createContext, useContext, useCallback, useRef, useEffect } from 'react';
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
  valuesRef: React.MutableRefObject<{ [nodeId: string]: Partial<TreeNode> }>;
  updateValue: (nodeId: string, field: string, value: string, isExternal?: boolean) => void;
  getValue: (nodeId: string, field: string) => string;
  externalUpdateCounter: number;
}

// 创建 Context
const FormContext = createContext<FormContextType | null>(null);

interface EditableCellProps {
  editing: boolean;
  nodeId: string;
  field: string;
  title: string;
  children: React.ReactNode;
  inputType?: 'input' | 'select';
  options?: Array<{ label: string; value: string }>;
  onValueChange?: (nodeId: string, value: string) => void;
  [key: string]: unknown;
}

// 自定义表格单元格编辑组件
const EditableCell = ({ 
  editing, 
  nodeId,
  field,
  title, 
  children,
  inputType = 'input',
  options = [],
  onValueChange,
  ...restProps 
}: EditableCellProps) => {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error('EditableCell must be used within FormProvider');
  }

  const { updateValue, getValue, externalUpdateCounter } = context;
  
  // 使用局部 state 管理输入值，避免每次输入都触发全局更新
  const [localValue, setLocalValue] = useState(() => getValue(nodeId, field));

  // 当编辑状态改变或 nodeId/field 改变时，同步 ref 中的值到局部 state
  useEffect(() => {
    setLocalValue(getValue(nodeId, field));
  }, [editing, nodeId, field, getValue]);

  // 当外部更新（比如联动逻辑）触发时，同步 ref 中的值到局部 state
  useEffect(() => {
    if (externalUpdateCounter > 0) {
      setLocalValue(getValue(nodeId, field));
    }
  }, [externalUpdateCounter, nodeId, field, getValue]);

  const handleChange = (value: string) => {
    // 立即更新局部 state，保证输入流畅
    setLocalValue(value);
    // 同步更新到 ref 中
    updateValue(nodeId, field, value);
    
    // 如果是值1字段，触发联动逻辑
    if (onValueChange && field === 'value1') {
      onValueChange(nodeId, value);
    }
  };

  const getInputNode = () => {
    if (inputType === 'select') {
      return (
        <Select 
          value={localValue}
          options={options} 
          placeholder={`请选择${title}`}
          onChange={handleChange}
        />
      );
    }
    return (
      <Input 
        value={localValue}
        placeholder={`请输入${title}`}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  };

  return (
    <td {...restProps}>
      {editing ? (
        <div style={{ margin: 0 }}>
          {getInputNode()}
        </div>
      ) : (
        children
      )}
    </td>
  );
};

interface TreeDataFormProps {
  data: TreeNode[];
}

// Form Provider 组件
const FormProvider = ({ 
  children, 
  initialValues,
  onValueChange,
  contextRef
}: { 
  children: React.ReactNode; 
  initialValues: { [nodeId: string]: Partial<TreeNode> };
  onValueChange?: (nodeId: string, field: string, value: string, updateValue: (nodeId: string, field: string, value: string, isExternal?: boolean) => void) => void;
  contextRef?: React.MutableRefObject<FormContextType | null>;
}) => {
  // 使用 ref 存储 values，避免触发 Context 重新渲染
  const valuesRef = useRef(initialValues);
  // 外部更新计数器，用于触发联动逻辑更新
  const [externalUpdateCounter, setExternalUpdateCounter] = useState(0);

  // 更新 ref 中的初始值（当 initialValues 改变时）
  useEffect(() => {
    valuesRef.current = initialValues;
  }, [initialValues]);

  const updateValue = useCallback((nodeId: string, field: string, value: string, isExternal = false) => {
    // 直接更新 ref，不触发重新渲染
    valuesRef.current = {
      ...valuesRef.current,
      [nodeId]: {
        ...valuesRef.current[nodeId],
        [field]: value
      }
    };
    
    // 如果是外部更新（比如联动逻辑），触发计数器更新
    if (isExternal) {
      setExternalUpdateCounter(prev => prev + 1);
    }
    
    // 调用外部联动逻辑，传入 updateValue 方法
    if (onValueChange) {
      onValueChange(nodeId, field, value, updateValue);
    }
  }, [onValueChange]);

  const getValue = useCallback((nodeId: string, field: string): string => {
    const value = valuesRef.current[nodeId]?.[field as keyof TreeNode];
    return typeof value === 'string' ? value : '';
  }, []);

  // Context 值包含方法、ref 和外部更新计数器
  const contextValue = { valuesRef, updateValue, getValue, externalUpdateCounter };
  
  // 将 context 值传递给外部 ref
  if (contextRef) {
    contextRef.current = {
      valuesRef,
      updateValue,
      getValue,
      externalUpdateCounter
    };
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

  // 处理值1变化时的联动逻辑（已废弃，联动逻辑在 handleContextValueChange 中处理）
  const handleValue1Change = () => {
    // 联动逻辑现在在 handleContextValueChange 中处理
  };

  // Context 值变化处理函数
  const handleContextValueChange = (nodeId: string, field: string, value: string, updateValue: (nodeId: string, field: string, value: string, isExternal?: boolean) => void) => {
    // 如果是值1变化，自动更新值2
    if (field === 'value1') {
      const linkedValue2 = getLinkedValue2(value);
      // 直接更新值2，标记为外部更新以触发 UI 更新
      setTimeout(() => {
        updateValue(nodeId, 'value2', linkedValue2, true);
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
    // 从 Context ref 获取当前所有值
    if (!contextRef.current) {
      message.error('表单数据获取失败！');
      return;
    }
    
    const currentValues = contextRef.current.valuesRef.current;
    
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
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'name',
        title: '名称',
        editing: isEditing,
      }),
    },
    {
      title: '值1',
      dataIndex: 'value1',
      key: 'value1',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'select',
        nodeId: record.id,
        field: 'value1',
        title: '值1',
        options: selectOptions.value1,
        onValueChange: handleValue1Change,
        editing: isEditing,
      }),
    },
    {
      title: '值2',
      dataIndex: 'value2',
      key: 'value2',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'select',
        nodeId: record.id,
        field: 'value2',
        title: '值2',
        options: selectOptions.value2,
        editing: isEditing,
      }),
    },
    {
      title: '值3',
      dataIndex: 'value3',
      key: 'value3',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'select',
        nodeId: record.id,
        field: 'value3',
        title: '值3',
        options: selectOptions.value3,
        editing: isEditing,
      }),
    },
    {
      title: '值4',
      dataIndex: 'value4',
      key: 'value4',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'select',
        nodeId: record.id,
        field: 'value4',
        title: '值4',
        options: selectOptions.value4,
        editing: isEditing,
      }),
    },
    {
      title: '值5',
      dataIndex: 'value5',
      key: 'value5',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'select',
        nodeId: record.id,
        field: 'value5',
        title: '值5',
        options: selectOptions.value5,
        editing: isEditing,
      }),
    },
    {
      title: '值6',
      dataIndex: 'value6',
      key: 'value6',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'value6',
        title: '值6',
        editing: isEditing,
      }),
    },
    {
      title: '值7',
      dataIndex: 'value7',
      key: 'value7',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'value7',
        title: '值7',
        editing: isEditing,
      }),
    },
    {
      title: '值8',
      dataIndex: 'value8',
      key: 'value8',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'value8',
        title: '值8',
        editing: isEditing,
      }),
    },
    {
      title: '值9',
      dataIndex: 'value9',
      key: 'value9',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'value9',
        title: '值9',
        editing: isEditing,
      }),
    },
    {
      title: '值10',
      dataIndex: 'value10',
      key: 'value10',
      width: 120,
      onCell: (record: TreeNode) => ({
        record,
        inputType: 'input',
        nodeId: record.id,
        field: 'value10',
        title: '值10',
        editing: isEditing,
      }),
    },
  ];

  const components = {
    body: {
      cell: EditableCell,
    },
  };

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

      <FormProvider 
        initialValues={buildInitialValues()}
        onValueChange={handleContextValueChange}
        contextRef={contextRef}
      >
        <Table
          components={components}
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

