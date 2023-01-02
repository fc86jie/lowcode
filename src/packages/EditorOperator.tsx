/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-29 12:04:50
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 10:52:32
 * @FilePath: \src\packages\EditorOperator.tsx
 * @Description:
 */

import { PropType } from 'vue';
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from 'element-plus';
import {
  configKey,
  editorKey,
  IChangeEditorData,
  IEditorBlock,
  IEditorConfig,
  IEditorContainer,
  IOption,
} from '@/inter';
import deepcopy from 'deepcopy';
import { useCommand } from './useCommand';
import TableEditor from './TableEditor';

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<IEditorBlock>,
    },
  },
  setup(props) {
    const config = inject(configKey) as IEditorConfig;
    const { getData } = inject(editorKey) as IChangeEditorData;

    const { commands } = useCommand();

    const state = reactive({
      editorData: {},
    });

    // 应用
    const apply = () => {
      // 更改容器配置
      if (!props.block) {
        commands.updateContainer({ ...getData(), container: state.editorData });
      } else {
        // 更改组件配置
        commands.updateBlock(state.editorData, props.block);
      }
    };

    // 重置
    const reset = () => {
      if (!props.block) {
        // 容器数据
        state.editorData = deepcopy(getData().container);
      } else {
        state.editorData = deepcopy(props.block);
      }
    };

    watch(() => props.block, reset, {
      immediate: true,
    });

    return () => {
      let content = [];
      if (!props.block) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber v-model={(state.editorData as IEditorContainer).width}></ElInputNumber>
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber v-model={(state.editorData as IEditorContainer).height}></ElInputNumber>
            </ElFormItem>
          </>
        );
      } else {
        let component = config.componentMap[props.block.key];
        if (component && component.props) {
          type TPropName = 'text' | 'color' | 'size' | 'type' | 'fontSize' | 'options';
          content.push(
            Object.entries(component.props).map(([propName, propConfig]) => {
              return (
                <ElFormItem label={propConfig.label}>
                  {{
                    input: () => (
                      <ElInput v-model={(state.editorData as IEditorBlock).props[propName as TPropName]}></ElInput>
                    ),
                    color: () => (
                      <ElColorPicker
                        v-model={(state.editorData as IEditorBlock).props[propName as TPropName]}
                      ></ElColorPicker>
                    ),
                    select: () => (
                      <ElSelect v-model={(state.editorData as IEditorBlock).props[propName as TPropName]}>
                        {(
                          propConfig as {
                            type: string;
                            label: string;
                            options: Array<IOption>;
                          }
                        ).options.map(({ label, value }) => (
                          <ElOption label={label} value={value}></ElOption>
                        ))}
                      </ElSelect>
                    ),
                    table: () => (
                      <TableEditor
                        propConfig={propConfig}
                        v-model={(state.editorData as IEditorBlock).props[propName as TPropName]}
                      ></TableEditor>
                    ),
                  }[propConfig.type]()}
                </ElFormItem>
              );
            })
          );
        }

        if (component && component.model) {
          content.push(
            Object.entries(component.model).map(([modelName, label]) => {
              return (
                <ElFormItem label={label}>
                  {/* model['default'] = 'username' */}
                  <ElInput
                    v-model={
                      (
                        state.editorData as IEditorBlock & {
                          model: {
                            [key: string]: string;
                          };
                        }
                      ).model[modelName]
                    }
                  ></ElInput>
                </ElFormItem>
              );
            })
          );
        }
      }

      return (
        <ElForm labelPosition="top" style={{ padding: '30px' }}>
          {content}
          <ElFormItem>
            <ElButton type="primary" onClick={apply}>
              应用
            </ElButton>
            <ElButton onClick={reset}>重置</ElButton>
          </ElFormItem>
        </ElForm>
      );
    };
  },
});
