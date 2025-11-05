import { Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { LogEntry } from '../types/logTypes';

interface LogViewerProps {
  open: boolean;
  onClose: () => void;
  logs: LogEntry[];
  nodeId: string;
}

/**
 * 日志查看器组件
 */
export const LogViewer = ({ open, onClose, logs, nodeId }: LogViewerProps) => {
  const columns: ColumnsType<LogEntry> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: number) => {
        try {
          const date = new Date(timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch {
          return new Date(timestamp).toLocaleString('zh-CN');
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: LogEntry['action']) => {
        const colorMap = {
          update: 'blue',
          delete: 'red',
          create: 'green',
        };
        const textMap = {
          update: '更新',
          delete: '删除',
          create: '创建',
        };
        return <Tag color={colorMap[action]}>{textMap[action]}</Tag>;
      },
    },
    {
      title: '字段',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
    },
    {
      title: '旧值',
      dataIndex: 'oldValue',
      key: 'oldValue',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#999', maxWidth: 200, display: 'inline-block' }}>
          {text || '(空)'}
        </span>
      ),
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#1890ff', maxWidth: 200, display: 'inline-block' }}>
          {text || '(空)'}
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={`日志记录 - ID: ${nodeId}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        size="small"
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

