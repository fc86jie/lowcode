/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 14:19:49
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 22:01:46
 * @FilePath: \src\utils\editor-config.tsx
 * @Description:
 */

import { IComponent, IEditorConfig, IOption } from '@/inter';
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus';
import Range from '@/components/Range';

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
        fontSize: props.fontSize,
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
    fontSize: {
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
  resize: {
    width: true,
    height: true,
  },
  preview: () => <ElButton>按钮预览</ElButton>,
  render: ({ props, size = {} }) => (
    <ElButton
      type={props.type}
      size={props.size}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
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
  resize: {
    width: true,
  },
  preview: () => <ElInput placeholder="输入框预览" />,
  render: ({ model, size = {} }) => (
    <ElInput placeholder="输入框渲染" {...model.default} style={{ width: `${size.width}px` }} />
  ),
  props: {},
  model: {
    default: '绑定字段',
  },
});

editorConfig.registry({
  key: 'range',
  label: '范围选择器',
  preview: () => <Range></Range>,
  render: ({ model }) => (
    <Range
      {...{
        start: model.start.modelValue as number,
        'onUpdate:start': model.start['onUpdate:modelValue'],
        end: model.end.modelValue as number,
        'onUpdate:end': model.end['onUpdate:modelValue'],
      }}
    ></Range>
  ),
  props: {},
  model: {
    start: '开始范围字段',
    end: '结束范围字段',
  },
});

editorConfig.registry({
  key: 'select',
  label: '下拉框',
  preview: () => <ElSelect></ElSelect>,
  render: ({ props, model }) => (
    <ElSelect {...model.default}>
      {(props.options || []).map((item: IOption, index) => (
        <ElOption label={item.label} value={item.value} key={index}></ElOption>
      ))}
    </ElSelect>
  ),
  props: {
    options: {
      type: 'table',
      label: '下拉选项',
      table: {
        options: [
          {
            label: '显示值',
            value: 'label',
          },
          {
            label: '绑定值',
            value: 'value',
          },
        ],
        key: 'label', // 显示给用户的值是label值
      },
    },
  },
  model: {
    default: '绑定字段',
  },
});
