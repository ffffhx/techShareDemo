/*
 * @Author: hxf hongxin.feng@transwarp.io
 * @Date: 2025-10-15 14:04:08
 * @LastEditors: hxf hongxin.feng@transwarp.io
 * @LastEditTime: 2025-10-15 15:03:33
 * @FilePath: \my-app\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { mock } from './mock/mock'
import { TreeDataForm } from './components/TreeDataForm'
import './App.css'

function App() {
  return (
    <div style={{ minHeight: '100vh',width: '100%', backgroundColor: '#f0f2f5' }}>
      <TreeDataForm data={mock.data} />
    </div>
  )
}

export default App
