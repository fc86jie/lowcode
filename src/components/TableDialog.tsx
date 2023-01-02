/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-01-02 11:03:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 20:31:06
 * @FilePath: \src\components\TableDialog.tsx
 * @Description:
 */

import { createVNode, defineComponent, PropType, render, RendererElement, RendererNode, VNode } from 'vue';
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from 'element-plus';
import deepcopy from 'deepcopy';
import { IOption } from '@/inter';

interface IOptions {
  config: {
    type: string;
    label: string;
    table: {
      options: Array<IOption>;
      key: string;
    };
  };
  data: Array<{ [key: string]: any }>;
  onConfirm?: (key: Array<{ [key: string]: any }>) => void;
}

const TableDialogComponent = defineComponent({
  props: {
    options: {
      type: Object as PropType<IOptions>,
      required: true,
    },
  },
  setup(props, { expose }) {
    const state = reactive<{ options: IOptions; isShow: boolean; editorData: Array<{ [key: string]: any }> }>({
      options: props.options,
      isShow: false,
      editorData: [],
    });

    const onConfirm = () => {
      state.isShow = false;
      state.options.onConfirm && state.options.onConfirm(state.editorData);
    };
    const onCancel = () => {
      state.isShow = false;
    };

    const onAdd = () => {
      state.editorData.push({});
    };
    const onReset = () => {
      state.editorData = state.options.data;
    };
    const onDel = (index: number) => {
      state.editorData.splice(index, 1);
    };

    expose({
      showDialog(options: IOptions) {
        state.options = options;
        state.isShow = true;
        state.editorData = deepcopy(options.data);
      },
    });

    return () => {
      return (
        <ElDialog v-model={state.isShow} title={state.options.config.label}>
          {{
            default: () => (
              <div>
                <div>
                  <ElButton type="primary" onClick={onAdd}>
                    添加
                  </ElButton>
                  <ElButton onClick={onReset}>重置</ElButton>
                  <ElTable data={state.editorData}>
                    <ElTableColumn type="index"></ElTableColumn>
                    {state.options.config.table.options.map((item, index) => (
                      <ElTableColumn label={item.label}>
                        {{
                          default: ({ row }: { row: { [key: string]: string | number } }) => {
                            return <ElInput v-model={row[item.value]}></ElInput>;
                          },
                        }}
                      </ElTableColumn>
                    ))}
                    <ElTableColumn label="操作">
                      {{
                        default: ({ $index }: { $index: number }) => {
                          return (
                            <ElButton
                              type="danger"
                              onClick={() => {
                                onDel($index);
                              }}
                            >
                              删除
                            </ElButton>
                          );
                        },
                      }}
                    </ElTableColumn>
                  </ElTable>
                </div>
              </div>
            ),
            footer: () => (
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
export function $tableDialog(options: IOptions) {
  let el = document.createElement('div');
  // 没有创建新的，有复用
  if (!vn) {
    vn = createVNode(TableDialogComponent, { options });
    render(vn, el);
    document.body.appendChild(el);
  }

  // 获取组件内部暴露的方法供调用
  let exposedCtx = vn.component?.exposed;
  exposedCtx?.showDialog(options);
}
