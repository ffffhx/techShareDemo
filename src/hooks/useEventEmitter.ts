// 事件类型定义
export type FieldChangeEvent = {
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

/**
 * 事件发射器 Hook
 * 用于组件间通信，特别是字段联动场景
 */
export const useEventEmitter = () => {
  const on = (event: string, listener: EventListener) => {
    eventEmitter.on(event, listener);
  };

  const off = (event: string, listener: EventListener) => {
    eventEmitter.off(event, listener);
  };

  const emit = (event: string, data: FieldChangeEvent) => {
    eventEmitter.emit(event, data);
  };

  return { on, off, emit };
};

