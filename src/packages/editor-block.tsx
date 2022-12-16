/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 10:10:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-16 12:11:37
 * @FilePath: \src\packages\editor-block.tsx
 * @Description:
 */

import { computed, defineComponent, PropType } from 'vue';
import { IEditorBlock } from '../inter';
import './editor-block.scss';
import { ElButton, ElInput } from 'element-plus';
export default defineComponent({
  components: {
    ElButton,
    ElInput,
  },
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
        <el-button class="editor-block" style={blockStyle.value}>
          按钮
        </el-button>
      ) : key === 'input' ? (
        <el-input class="editor-block" style={blockStyle.value} />
      ) : (
        ''
      );
  },
});
