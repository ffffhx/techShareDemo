/*
 * @Author: hxf hongxin.feng@transwarp.io
 * @Date: 2025-10-15 14:23:37
 * @LastEditors: hxf hongxin.feng@transwarp.io
 * @LastEditTime: 2025-11-06 23:06:01
 * @FilePath: \my-app\src\components\TreeDataForm.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react';
import { Form, Button, Space, Typography, message, Table } from 'antd';
import type { Key } from 'react';
import type { TableProps } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { TreeDataFormProps, TreeNode } from './TreeDataForm/types';
import { useTreeData } from './TreeDataForm/hooks/useTreeData';
import { useFormValues } from './TreeDataForm/hooks/useFormValues';
import { useTableColumns } from './TreeDataForm/hooks/useTableColumns';
import { useLogs } from './TreeDataForm/hooks/useLogs';
import { removeNodeById, updateAllNodes } from './TreeDataForm/utils/treeUtils';
import { LogViewer } from './TreeDataForm/components/LogViewer';
import { flattenTree } from './TreeDataForm/utils/treeUtils';

const { Text } = Typography;

export const TreeDataForm = ({ data }: TreeDataFormProps) => {
  const { treeData, setTreeData, listData } = useTreeData(data);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [form] = Form.useForm();
  const { buildFormValues } = useFormValues(form);
  
  // 日志管理
  const {
    recordInitialValues,
    logBatchChanges,
    logDelete,
    getNodeLogs,
  } = useLogs();

  // 日志查看器状态
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [currentLogNodeId, setCurrentLogNodeId] = useState<string>('');

  // 删除节点（及其子节点）
  const handleDeleteRow = (nodeId: string) => {
    // 找到要删除的节点数据
    const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const nodeToDelete = findNodeById(treeData, nodeId);
    if (nodeToDelete) {
      logDelete(nodeId, nodeToDelete);
    }
    
    setTreeData((prev) => removeNodeById(prev, nodeId));
    message.success('已删除');
  };

  // 查看日志
  const handleViewLogs = (nodeId: string) => {
    setCurrentLogNodeId(nodeId);
    setLogViewerOpen(true);
  };

  // 使用自定义 hook 生成列配置
  const columns = useTableColumns({
    isEditing,
    form,
    onDeleteRow: handleDeleteRow,
    onViewLogs: handleViewLogs,
  });

  const handleEdit = () => {
    console.time('⏱️ handleEdit 总耗时');
    
    // 切换状态时清空已选中
    setSelectedRowKeys([]);
    
    // 记录所有节点的初始值
    console.time('📊 1. flattenTree - 扁平化树形数据');
    const flatData = flattenTree(treeData);
    console.timeEnd('📊 1. flattenTree - 扁平化树形数据');
    console.log(`   └─ 扁平化后共 ${flatData.length} 行数据`);
    
    console.time('📝 2. recordInitialValues - 记录初始值');
    flatData.forEach((node) => {
      recordInitialValues(node.id, {
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
        status: node.status,
      });
    });
    console.timeEnd('📝 2. recordInitialValues - 记录初始值');

    // 设置表单初始值
    console.time('🔧 3. buildFormValues - 构建表单值对象');
    const buildStartTime = performance.now();
    const formValues = buildFormValues(treeData);
    const buildEndTime = performance.now();
    console.timeEnd('🔧 3. buildFormValues - 构建表单值对象');
    console.log(`   └─ 构建表单值对象耗时: ${(buildEndTime - buildStartTime).toFixed(2)}ms`);
    console.log(`   └─ 表单字段数量: ${Object.keys(formValues).length} 个节点`);
    
    console.time('⚡ 4. form.setFieldsValue - 设置表单字段值（最耗时）');
    const setFieldsStartTime = performance.now();
    
    // 注意：form.setFieldsValue 可能触发异步更新，真正的耗时在 React 渲染阶段
    form.setFieldsValue(formValues);
    
    // 使用 requestAnimationFrame 来测量包含后续渲染的耗时
    requestAnimationFrame(() => {
      const setFieldsEndTime = performance.now();
      console.log(`   └─ form.setFieldsValue 调用耗时: ${(setFieldsEndTime - setFieldsStartTime).toFixed(2)}ms`);
      console.log(`   ⚠️  注意：实际的表单更新和渲染耗时可能在 React 渲染阶段，请查看 Performance 面板`);
    });
    
    const setFieldsSyncEnd = performance.now();
    console.timeEnd('⚡ 4. form.setFieldsValue - 设置表单字段值（最耗时）');
    console.log(`   └─ 同步调用耗时: ${(setFieldsSyncEnd - setFieldsStartTime).toFixed(2)}ms`);
    console.log(`   └─ 表单字段数量: ${Object.keys(formValues).length} 个节点 × 12 个字段 = ${Object.keys(formValues).length * 12} 个字段`);
    
    console.time('🔄 5. setIsEditing - 状态更新');
    setIsEditing(true);
    console.timeEnd('🔄 5. setIsEditing - 状态更新');
    
    console.timeEnd('⏱️ handleEdit 总耗时');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  };

  const handleSave = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();

      // 记录所有变更的日志
      Object.keys(values).forEach((nodeId) => {
        logBatchChanges(nodeId, values[nodeId]);
      });

      // 更新所有节点的数据
      setTreeData((prev) => updateAllNodes(prev, values));
      
      // 切换状态时清空已选中
      setSelectedRowKeys([]);
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
    
    // 切换状态时清空已选中
    setSelectedRowKeys([]);
    setIsEditing(false);
  };

  // 表格行选择配置（多选）
  const rowSelection: TableProps<TreeNode>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys as Key[]),
    columnWidth: 48,
    fixed: true,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    preserveSelectedRowKeys: true,
  };

  return (
    <div style={{ padding: 24, width: '100%' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            树形数据表单
          </Typography.Title>
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
          dataSource={isEditing ? listData : treeData}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: 1500 }}
          bordered
          // 仅在树形查看态时展开所有行
          {...(!isEditing ? { defaultExpandAllRows: true } : {})}
        />
      </Form>

      {/* 日志查看器 */}
      <LogViewer
        open={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
        logs={getNodeLogs(currentLogNodeId)}
        nodeId={currentLogNodeId}
      />
    </div>
  );
};
