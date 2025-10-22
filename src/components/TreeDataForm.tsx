import React, { useState, useRef, useCallback, useEffect } from 'react';
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

// 可编辑字段渲染组件 - 用于 render 函数
interface RenderEditableFieldProps {
  editing: boolean;
  nodeId: string;
  field: string;
  title: string;
  value: string;
  inputType?: 'input' | 'select';
  options?: Array<{ label: string; value: string }>;
  updateDraftField?: (nodeId: string, field: string, value: string) => void;
  linkedFields?: string[];
}

const RenderEditableField = ({ 
  editing, 
  nodeId,
  field,
  title, 
  value,
  inputType = 'input',
  options = [],
  updateDraftField,
  linkedFields,
}: RenderEditableFieldProps) => {
  const [localValue, setLocalValue] = useState<string>(value);
  const [isVisible, setIsVisible] = useState(false); // 可视化懒加载状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const cellRef = useRef<HTMLDivElement>(null);
  
  // 判断是否为联动字段
  const isLinkedField = linkedFields?.includes(field) || false;
  
  // 监听联动字段变化事件
  const handleLinkedFieldChange = useCallback((event: FieldChangeEvent) => {
    console.log('handleLinkedFieldChange', event.value);
    if (event.nodeId === nodeId && event.field === field) {
      setLocalValue(event.value);
    }
  }, [nodeId, field]);

   // 可视化懒加载：使用 Intersection Observer 检测可见性
   useEffect(() => {
     if (!editing) return;

     setIsLoading(true);

     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach((entry) => {
           if (entry.isIntersecting) {
             // 模拟加载延迟，让用户看到加载效果
             setTimeout(() => {
               setIsVisible(true);
               setLocalValue(value);
               setIsLoading(false);
             }, Math.random() * 500 + 100); // 100-600ms的随机延迟
           }
         });
       },
       {
         rootMargin: '50px', // 提前50px开始渲染
         threshold: 0.1
       }
     );

     if (cellRef.current) {
       observer.observe(cellRef.current);
     }

     return () => {
       observer.disconnect();
     };
   }, [editing, value]);

  // 注册事件监听器 - 只给联动字段注册
  useEffect(() => {
    if (isVisible && isLinkedField) {
      // 只有联动字段才需要监听事件
      eventEmitter.on('linkChange', handleLinkedFieldChange);
      return () => {
        eventEmitter.off('linkChange', handleLinkedFieldChange);
      };
    }
  }, [isVisible, isLinkedField, handleLinkedFieldChange]);

   // 重置可视化状态
   useEffect(() => {
     if (!editing) {
       setIsVisible(false);
       setIsLoading(false);
     }
   }, [editing]);

  const getInputNode = () => {
    if (inputType === 'select') {
      return (
        <Select 
          value={localValue}
          options={options} 
          placeholder={`请选择${title}`}
          onChange={(value) => {
            setLocalValue(value);
            
            if (isLinkedField) {
              // 联动字段：触发事件
              eventEmitter.emit('linkChange', {
                nodeId, field, value
              });
            } else {
              // 普通字段：直接写入草稿本
              updateDraftField?.(nodeId, field, value);
            }
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
          
          if (isLinkedField) {
            // 联动字段：触发事件
            eventEmitter.emit('linkChange', {
              nodeId, field, value
            });
          } else {
            // 普通字段：直接写入草稿本
            updateDraftField?.(nodeId, field, value);
          }
        }}
      />
    );
  };

  // 渲染假的输入框占位符 - 模拟真实的 Ant Design 组件样式
  const getFakeInput = () => {
    if (inputType === 'select') {
      return (
        <div style={{
          height: '32px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '4px 11px',
          cursor: 'not-allowed',
          opacity: 0.7,
          transition: 'all 0.3s ease'
        }}>
          <span style={{ 
            color: value ? '#000000d9' : '#bfbfbf', 
            fontSize: '14px',
            transition: 'color 0.3s ease'
          }}>
            {value || `请选择${title}`}
          </span>
          <div style={{
            marginLeft: 'auto',
            width: '0',
            height: '0',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #bfbfbf',
            transition: 'border-color 0.3s ease'
          }} />
        </div>
      );
    }
    return (
      <div style={{
        height: '32px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '4px 11px',
        cursor: 'not-allowed',
        opacity: 0.7,
        transition: 'all 0.3s ease'
      }}>
        <span style={{ 
          color: value ? '#000000d9' : '#bfbfbf', 
          fontSize: '14px',
          transition: 'color 0.3s ease'
        }}>
          {value || `请输入${title}`}
        </span>
      </div>
    );
  };

  if (!editing) {
    return <span>{value}</span>;
  }

  return (
    <div ref={cellRef} style={{ margin: 0 }}>
      {isVisible ? (
        getInputNode()
      ) : (
        <div style={{ 
          opacity: isLoading ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}>
          {getFakeInput()}
        </div>
      )}
    </div>
  );
};

interface TreeDataFormProps {
  data: TreeNode[];
}

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(data);
  const [isEditing, setIsEditing] = useState(false);
  
  // 草稿本：存储所有字段的编辑数据
  const formDataRef = useRef<{ [nodeId: string]: Partial<TreeNode> }>({});
  
  // 联动字段列表：只有这些字段需要监听事件
  const linkedFields = ['value1', 'value2'];

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

  // 联动字段变化事件处理 - 只处理需要联动的字段
  const handleLinkedFieldChange = useCallback((event: FieldChangeEvent) => {
    const { nodeId, field, value } = event;
    
    // 更新草稿本中的数据
    if (!formDataRef.current[nodeId]) {
      formDataRef.current[nodeId] = {};
    }
    (formDataRef.current[nodeId] as Record<string, string>)[field] = value;
    
    // 联动逻辑：如果是值1变化，自动更新值2
    if (field === 'value1') {
      const linkedValue2 = getLinkedValue2(value);
      
      // 更新草稿本中的值2
      formDataRef.current[nodeId].value2 = linkedValue2;
      
      // 通过事件通知值2的单元格更新显示
      setTimeout(() => {
        eventEmitter.emit('linkChange', {
          nodeId,
          field: 'value2',
          value: linkedValue2
        });
      }, 0);
    }
  }, []);

  // 普通字段变化处理 - 直接写入草稿本，不触发事件
  const updateDraftField = useCallback((nodeId: string, field: string, value: string) => {
    if (!formDataRef.current[nodeId]) {
      formDataRef.current[nodeId] = {};
    }
    (formDataRef.current[nodeId] as Record<string, string>)[field] = value;
  }, []);

  // 注册联动字段事件监听器 - 只监听需要联动的字段
  React.useEffect(() => {
    eventEmitter.on('linkChange', handleLinkedFieldChange);
    return () => {
      eventEmitter.off('linkChange', handleLinkedFieldChange);
    };
  }, [handleLinkedFieldChange]);

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
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="name"
          title="名称"
          value={record.name}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值1',
      dataIndex: 'value1',
      key: 'value1',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value1"
          title="值1"
          value={record.value1}
          inputType="select"
          options={selectOptions.value1}
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值2',
      dataIndex: 'value2',
      key: 'value2',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value2"
          title="值2"
          value={record.value2}
          inputType="select"
          options={selectOptions.value2}
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值3',
      dataIndex: 'value3',
      key: 'value3',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value3"
          title="值3"
          value={record.value3}
          inputType="select"
          options={selectOptions.value3}
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值4',
      dataIndex: 'value4',
      key: 'value4',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value4"
          title="值4"
          value={record.value4}
          inputType="select"
          options={selectOptions.value4}
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值5',
      dataIndex: 'value5',
      key: 'value5',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value5"
          title="值5"
          value={record.value5}
          inputType="select"
          options={selectOptions.value5}
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值6',
      dataIndex: 'value6',
      key: 'value6',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value6"
          title="值6"
          value={record.value6}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值7',
      dataIndex: 'value7',
      key: 'value7',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value7"
          title="值7"
          value={record.value7}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值8',
      dataIndex: 'value8',
      key: 'value8',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value8"
          title="值8"
          value={record.value8}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值9',
      dataIndex: 'value9',
      key: 'value9',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value9"
          title="值9"
          value={record.value9}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
    },
    {
      title: '值10',
      dataIndex: 'value10',
      key: 'value10',
      width: 120,
      render: (_text: string, record: TreeNode) => (
        <RenderEditableField
          editing={isEditing}
          nodeId={record.id}
          field="value10"
          title="值10"
          value={record.value10}
          inputType="input"
          updateDraftField={updateDraftField}
          linkedFields={linkedFields}
        />
      ),
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

      <Table
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

