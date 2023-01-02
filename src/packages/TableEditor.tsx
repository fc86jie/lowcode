/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-01-02 10:47:23
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 20:06:07
 * @FilePath: \src\packages\TableEditor.tsx
 * @Description:
 */

import { PropType } from 'vue';
import { ElButton, ElTag } from 'element-plus';
import deepcopy from 'deepcopy';
import { $tableDialog } from '@/components/TableDialog';
import { IOption } from '@/inter';

export default defineComponent({
  props: {
    propConfig: {
      type: Object,
    },
    modelValue: {
      type: Object as PropType<{ [key: string]: any }>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.modelValue || [];
      },
      set(newVal) {
        emit('update:modelValue', deepcopy(newVal));
      },
    });

    interface IPropConfig {
      type: string;
      label: string;
      table: {
        options: Array<IOption>;
        key: string;
      };
    }

    const onAdd = () => {
      $tableDialog({
        config: props.propConfig as IPropConfig,
        data: data.value as Array<{}>,
        onConfirm(value) {
          data.value = value;
        },
      });
    };

    return () => {
      return (
        <div>
          <div>
            <ElButton type="primary" onClick={onAdd}>
              添加
            </ElButton>
          </div>
          {(data.value || []).map((item: { [key: string]: any }) => (
            <ElTag onClick={onAdd}>{item[(props.propConfig as IPropConfig).table.key]}</ElTag>
          ))}
        </div>
      );
    };
  },
});
