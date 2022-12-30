/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 14:19:49
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-29 19:20:48
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
  render: ({ props }) => (
    <span
      style={{
        color: props.color,
        fontSize: props.size,
      }}
    >
      {props.text || '文本渲染'}
    </span>
  ),
  props: {
    text: {
      type: 'input',
      label: '文本内容',
    },
    color: {
      type: 'color',
      label: '字体颜色',
    },
    size: {
      type: 'select',
      label: '字体大小',
      options: [
        {
          label: '14px',
          value: '14px',
        },
        {
          label: '20px',
          value: '20px',
        },
        {
          label: '24px',
          value: '24px',
        },
      ],
    },
  },
});

editorConfig.registry({
  key: 'button',
  label: '按钮',
  preview: () => <ElButton>按钮预览</ElButton>,
  render: ({ props }) => (
    <ElButton type={props.type} size={props.size}>
      {props.text || '按钮渲染'}
    </ElButton>
  ),
  props: {
    text: {
      type: 'input',
      label: '按钮内容',
    },
    type: {
      type: 'select',
      label: '按钮类型',
      options: [
        {
          label: '基础',
          value: 'primary',
        },
        {
          label: '成功',
          value: 'success',
        },
        {
          label: '警告',
          value: 'warning',
        },
        {
          label: '危险',
          value: 'danger',
        },
        {
          label: '默认',
          value: 'default',
        },
      ],
    },
    size: {
      type: 'select',
      label: '按钮尺寸',
      options: [
        {
          label: '大',
          value: 'large',
        },
        {
          label: '默认',
          value: '',
        },
        {
          label: '小',
          value: 'small',
        },
      ],
    },
  },
});

editorConfig.registry({
  key: 'input',
  label: '输入框',
  preview: () => <ElInput placeholder="输入框预览" />,
  render: () => <ElInput placeholder="输入框渲染" />,
  props: {},
});
