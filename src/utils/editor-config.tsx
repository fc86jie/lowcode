/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 14:19:49
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-24 23:17:33
 * @FilePath: \src\utils\editor-config.tsx
 * @Description:
 */

import { IComponent, IEditorConfig } from '@/inter';
import { ElButton, ElInput } from 'element-plus';

function createEditorConfig(): IEditorConfig {
  const componentList: Array<IComponent> = [];
  const componentMap: { [key: string]: IComponent } = {};
  return {
    componentList,
    componentMap,
    registry: (component: IComponent) => {
      componentList.push(component);
      componentMap[component.key] = component;
    },
  };
}

export let editorConfig = createEditorConfig();

editorConfig.registry({
  key: 'text',
  label: '文本',
  preview: () => '文本预览',
  render: () => '文本渲染',
});

editorConfig.registry({
  key: 'button',
  label: '按钮',
  preview: () => <ElButton>按钮预览</ElButton>,
  render: () => <ElButton>按钮渲染</ElButton>,
});

editorConfig.registry({
  key: 'input',
  label: '输入框',
  preview: () => <ElInput placeholder="输入框预览" />,
  render: () => <ElInput placeholder="输入框渲染" />,
});
