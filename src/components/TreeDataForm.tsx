import React, { useState, useRef, useCallback } from 'react';
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

// 事件类型定义
type FieldChangeEvent = {
  nodeId: string;
  field: string;
  value: string;
};

// 事件监听器类型
type EventListener = (event: FieldChangeEvent) => void;

// 简单的事件系统
class EventEmitter {
  private listeners: { [event: string]: EventListener[] } = {};

  on(event: string, listener: EventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: EventListener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
  }

  emit(event: string, data: FieldChangeEvent) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(data));
    }
  }
}

// 全局事件发射器
const eventEmitter = new EventEmitter();

interface EditableCellProps {
  editing: boolean;
  nodeId: string;
  field: string;
  title: string;
  children: React.ReactNode;
  inputType?: 'input' | 'select';
  options?: Array<{ label: string; value: string }>;
  initialValue?: string;
  [key: string]: unknown;
}


// 优化的编辑单元格组件 - 分批渲染避免卡顿
const EditableCell = ({ 
  editing, 
  nodeId,
  field,
  title, 
  children,
  inputType = 'input',
  options = [],
  initialValue = '',
  ...restProps 
}: EditableCellProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const [localValue, setLocalValue] = useState<string>(initialValue);
  
  // 监听字段变化事件
  const handleFieldChange = useCallback((event: FieldChangeEvent) => {
    if (event.nodeId === nodeId && event.field === field) {
      setLocalValue(event.value);
    }
  }, [nodeId, field]);

  // 分批渲染：根据行索引和列索引计算延迟时间
  React.useEffect(() => {
    if (editing && !isRendered) {
      const rowIndex = parseInt(nodeId.split('-')[0]) || 0;
      const colIndex = ['name', 'value1', 'value2', 'value3', 'value4', 'value5', 'value6', 'value7', 'value8', 'value9', 'value10'].indexOf(field);
      
      // 计算延迟时间：前面的行和列优先渲染
      const delay = (rowIndex * 10 + colIndex) * 2; // 每批次间隔2ms，更快
      
      const timer = setTimeout(() => {
        setIsRendered(true);
        setLocalValue(initialValue);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (!editing) {
      setIsRendered(false);
    }
  }, [editing, nodeId, field, initialValue, isRendered]);

  // 注册事件监听器
  React.useEffect(() => {
    if (isRendered) {
      eventEmitter.on('fieldChange', handleFieldChange);
      return () => {
        eventEmitter.off('fieldChange', handleFieldChange);
      };
    }
  }, [isRendered, handleFieldChange]);

  const getInputNode = () => {
    if (inputType === 'select') {
      return (
        <Select 
          value={localValue}
          options={options} 
          placeholder={`请选择${title}`}
          onChange={(value) => {
            setLocalValue(value);
            eventEmitter.emit('fieldChange', {
              nodeId, field, value
            });
          }}
        />
      );
    }
    return (
      <Input 
        value={localValue}
        placeholder={`请输入${title}`}
        onChange={(e) => {
          const value = e.target.value;
          setLocalValue(value);
          eventEmitter.emit('fieldChange', {
            nodeId, field, value
          });
        }}
      />
    );
  };

  return (
    <td {...restProps}>
      {editing ? (
        <div style={{ margin: 0 }}>
          {isRendered ? (
            getInputNode()
          ) : (
            <div style={{ 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center',
              color: '#999',
              fontSize: '12px'
            }}>
              加载中...
            </div>
          )}
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

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(data);
  const [isEditing, setIsEditing] = useState(false);
  
  // 使用 ref 存储所有表单数据，避免 re-render
  const formDataRef = useRef<{ [nodeId: string]: Partial<TreeNode> }>({});

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

  // 初始化表单数据
  const initializeFormData = useCallback(() => {
    const formData: { [nodeId: string]: Partial<TreeNode> } = {};
    
    const buildFormData = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        formData[node.id] = {
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
          buildFormData(node.children);
        }
      });
    };
    
    buildFormData(treeData);
    formDataRef.current = formData;
  }, [treeData]);

  // 字段变化事件处理
  const handleFieldChange = useCallback((event: FieldChangeEvent) => {
    const { nodeId, field, value } = event;
    
    // 更新 ref 中的数据
    if (!formDataRef.current[nodeId]) {
      formDataRef.current[nodeId] = {};
    }
    (formDataRef.current[nodeId] as Record<string, string>)[field] = value;
    
    // 联动逻辑：如果是值1变化，自动更新值2
    if (field === 'value1') {
      const linkedValue2 = getLinkedValue2(value);
      
      // 更新 ref 中的值2
      formDataRef.current[nodeId].value2 = linkedValue2;
      
      // 通过事件通知值2的单元格更新
      setTimeout(() => {
        eventEmitter.emit('fieldChange', {
          nodeId,
          field: 'value2',
          value: linkedValue2
        });
      }, 0);
    }
  }, []);

  // 注册字段变化事件监听器
  React.useEffect(() => {
    eventEmitter.on('fieldChange', handleFieldChange);
    return () => {
      eventEmitter.off('fieldChange', handleFieldChange);
    };
  }, [handleFieldChange]);

  const handleEdit = () => {
    // 初始化表单数据
    initializeFormData();
    setIsEditing(true);
    message.success('已进入编辑模式，所有单元格已变为可编辑状态');
  };

  const handleSave = () => {
    // 从 ref 获取当前所有值
    const currentValues = formDataRef.current;
    
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
    // 重置表单数据
    initializeFormData();
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
        initialValue: record.name,
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
        editing: isEditing,
        initialValue: record.value1,
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
        initialValue: record.value2,
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
        initialValue: record.value3,
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
        initialValue: record.value4,
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
        initialValue: record.value5,
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
        initialValue: record.value6,
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
        initialValue: record.value7,
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
        initialValue: record.value8,
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
        initialValue: record.value9,
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
        initialValue: record.value10,
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
    </div>
  );
};

