/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-27 12:05:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-27 13:54:30
 * @FilePath: \src\components\dialog.tsx
 * @Description:
 */

import { ElButton, ElDialog, ElInput } from 'element-plus';
import { createVNode, defineComponent, PropType, render, RendererElement, RendererNode, VNode } from 'vue';

interface IOptions {
  title: string;
  content: string;
  footer?: boolean;
  onConfirm?: (key: string) => void;
}

const dialogComponent = defineComponent({
  props: {
    options: {
      type: Object as PropType<IOptions>,
      required: true,
    },
  },
  setup(props, { expose }) {
    const state = reactive<{ options: IOptions; isShow: boolean }>({
      options: props.options,
      isShow: false,
    });

    const onConfirm = () => {
      state.isShow = false;
      state.options.onConfirm && state.options.onConfirm(state.options.content);
    };
    const onCancel = () => {
      state.isShow = false;
    };

    expose({
      showDialog(options: IOptions) {
        state.options = options;
        state.isShow = true;
      },
    });

    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.options.title}>
          {{
            default: () => <ElInput type="textarea" v-model={state.options.content} rows={10}></ElInput>,
            footer: () =>
              state.options.footer && (
                <div>
                  <ElButton onClick={onCancel}>取消</ElButton>
                  <ElButton type="primary" onClick={onConfirm}>
                    确定
                  </ElButton>
                </div>
              ),
          }}
        </ElDialog>
      );
    };
  },
});

let vn: VNode<RendererNode, RendererElement, { [key: string]: any }> | null;
export function $dialog(options: IOptions) {
  let el = document.createElement('div');
  // 没有创建新的，有复用
  if (!vn) {
    vn = createVNode(dialogComponent, { options });
    render(vn, el);
    document.body.appendChild(el);
  }

  // 获取组件内部暴露的方法供调用
  let exposedCtx = vn.component?.exposed;
  exposedCtx?.showDialog(options);
}
