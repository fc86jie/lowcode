/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 10:10:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-16 10:34:26
 * @FilePath: \src\packages\editor-block.tsx
 * @Description:
 */

import { computed, defineComponent, PropType } from 'vue';
import { IEditorBlock } from '../inter';
import './editor-block.scss';

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<IEditorBlock>,
      required: true,
    },
  },
  setup(props) {
    const {
      block,
      block: { key },
    } = props;

    // 获取根据block配置获取样式
    const blockStyle = computed(() => ({
      left: `${block.left}px`,
      top: `${block.top}px`,
      zIndex: block.zIndex,
    }));

    return () =>
      key === 'text' ? (
        <div class="editor-block" style={blockStyle.value}></div>
      ) : key === 'button' ? (
        <button class="editor-block" style={blockStyle.value}></button>
      ) : key === 'input' ? (
        <input class="editor-block" style={blockStyle.value} />
      ) : (
        ''
      );
  },
});
