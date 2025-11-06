# 表单事件系统优化说明

## 📊 优化概览

本次优化采用统一的事件驱动架构，简化了代码结构，提高了可维护性。

## 🎯 核心改动

### 1. 联动配置化

```typescript
// 集中管理联动关系
const LINKAGE_CONFIG = {
  value1: {
    affects: ['value2'],  // value1 变化会影响 value2
  }
  // 未来添加新联动只需在此配置
};

// 自动计算需要监听事件的字段
const FIELDS_NEED_LISTENER = new Set<string>();
Object.values(LINKAGE_CONFIG).forEach(config => {
  config.affects.forEach(field => FIELDS_NEED_LISTENER.add(field));
});
// 结果: Set(['value2'])
```

### 2. 组件简化

#### 之前：需要传递多个 props
```typescript
<RenderEditableField
  editing={isEditing}
  nodeId={record.id}
  field="value6"
  value={record.value6}
  inputType="input"
  updateDraftField={updateDraftField}  // ❌ 需要传递
  linkedFields={linkedFields}          // ❌ 需要传递
/>
```

#### 现在：只需要基本 props
```typescript
<RenderEditableField
  editing={isEditing}
  nodeId={record.id}
  field="value6"
  value={record.value6}
  inputType="input"
  // ✅ 不需要业务逻辑相关的 props
/>
```

### 3. 统一事件流

#### 所有字段都发送事件
```typescript
onChange={(e) => {
  setLocalValue(e.target.value);
  validate(e.target.value);
  // 所有字段统一发送 fieldChange 事件
  eventEmitter.emit('fieldChange', {
    nodeId, field, value
  });
}}
```

#### 只有被联动影响的字段才监听
```typescript
// 自动判断是否需要监听
const needsListener = FIELDS_NEED_LISTENER.has(field);

useEffect(() => {
  if (isVisible && needsListener) {
    eventEmitter.on('fieldChange', handleFieldChange);
    return () => eventEmitter.off('fieldChange', handleFieldChange);
  }
}, [isVisible, needsListener, handleFieldChange]);
```

### 4. 父组件统一处理

```typescript
const handleFieldChange = useCallback((event: FieldChangeEvent) => {
  const { nodeId, field, value } = event;
  
  // 1. 更新草稿本
  formDataRef.current[nodeId][field] = value;
  
  // 2. 检查联动逻辑
  const linkageConfig = LINKAGE_CONFIG[field];
  if (linkageConfig) {
    // 执行联动逻辑
    if (field === 'value1') {
      const linkedValue2 = getLinkedValue2(value);
      formDataRef.current[nodeId].value2 = linkedValue2;
      
      // 通知 value2 组件更新
      eventEmitter.emit('fieldChange', {
        nodeId,
        field: 'value2',
        value: linkedValue2
      });
    }
  }
}, []);
```

## 📋 字段监听表

| 字段 | 发送事件 | 监听事件 | 原因 |
|------|---------|---------|------|
| name | ✅ | ❌ | 只会被用户修改 |
| value1 | ✅ | ❌ | 触发联动，但自己不被联动 |
| value2 | ✅ | ✅ | **会被 value1 联动** |
| value3-10 | ✅ | ❌ | 只会被用户修改 |

## 🎨 优势

### 1. 代码更简洁
- ✅ 移除 `updateDraftField` props
- ✅ 移除 `linkedFields` props
- ✅ 组件不需要关心业务逻辑

### 2. 易于扩展
添加新的联动关系只需两步：

```typescript
// 步骤 1: 在 LINKAGE_CONFIG 添加配置
const LINKAGE_CONFIG = {
  value1: { affects: ['value2'] },
  value3: { affects: ['value4'] },  // ✅ 添加新联动
};

// 步骤 2: 在 handleFieldChange 添加逻辑
if (field === 'value3') {
  const linkedValue4 = calcValue4(value);
  formDataRef.current[nodeId].value4 = linkedValue4;
  eventEmitter.emit('fieldChange', {
    nodeId,
    field: 'value4',
    value: linkedValue4
  });
}
```

### 3. 性能优化
- ✅ 只有被联动影响的字段才监听事件
- ✅ 减少不必要的事件监听器
- ✅ 减少 props 传递

### 4. 类型安全
- ✅ 通过 LINKAGE_CONFIG 管理联动关系
- ✅ TypeScript 类型检查更完整

## 🔄 数据流

```
用户修改 value1 为 "选项A1"
    ↓
setLocalValue("选项A1")  ← 立即更新显示
    ↓
emit('fieldChange', { field: 'value1', value: '选项A1' })
    ↓
父组件 handleFieldChange 监听到
    ↓
1. 更新草稿本: formDataRef.current[nodeId].value1 = '选项A1'
2. 检查联动: LINKAGE_CONFIG.value1.affects = ['value2']
3. 计算联动值: value2 = '选项A2'
4. 更新草稿本: formDataRef.current[nodeId].value2 = '选项A2'
5. 发送事件: emit('fieldChange', { field: 'value2', value: '选项A2' })
    ↓
value2 组件监听到事件
    ↓
setLocalValue("选项A2")  ← 自动更新显示 ✅
```

## 🧪 测试要点

1. **普通字段输入**：value6-10 输入是否正常保存
2. **联动功能**：value1 改变时 value2 是否自动更新
3. **多节点**：不同节点的联动是否互不干扰
4. **表单验证**：空值验证是否正常
5. **保存功能**：数据是否正确保存到 treeData

## 📚 未来优化方向

1. **可视化联动关系**：自动生成联动关系图
2. **联动规则DSL**：用配置文件定义复杂联动规则
3. **性能监控**：添加事件性能监控
4. **事件重放**：支持撤销/重做功能

## 💡 最佳实践

1. **添加新字段**：只需在 render 中添加 RenderEditableField
2. **添加联动**：在 LINKAGE_CONFIG 声明，在 handleFieldChange 实现
3. **调试**：查看 console 中的 fieldChange 事件
4. **扩展**：所有扩展都在父组件，不修改子组件

## 🎉 总结

这次优化实现了：
- ✅ 统一的事件架构
- ✅ 更简洁的组件接口
- ✅ 更好的可维护性
- ✅ 更容易扩展的联动系统
- ✅ 更好的性能（只有必要的字段监听事件）

