/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-01-01 19:15:04
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-01 20:24:35
 * @FilePath: \src\components\Range.tsx
 * @Description:
 */

import { ElInputNumber } from 'element-plus';
import './Range.scss';

export default defineComponent({
  props: {
    start: {
      type: Number,
    },
    end: {
      type: Number,
    },
  },
  emits: ['update:start', 'update:end'],
  setup(props, { emit }) {
    const start = computed({
      get() {
        return props.start;
      },
      set(newVal) {
        emit('update:start', newVal);
      },
    });

    const end = computed({
      get() {
        return props.end;
      },
      set(newVal) {
        emit('update:end', newVal);
      },
    });

    return () => {
      return (
        <div class="range">
          <ElInputNumber v-model={start.value}></ElInputNumber>
          <span class="separator">~</span>
          <ElInputNumber v-model={end.value}></ElInputNumber>
        </div>
      );
    };
  },
});
