/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 10:10:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-16 18:23:43
 * @FilePath: \src\packages\editor-block.tsx
 * @Description:
 */

import { computed, defineComponent, inject, PropType } from 'vue';
import { IEditorBlock, IEditorConfig, configKey } from '../inter';
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

    const config = inject(configKey) as IEditorConfig;

    return () => {
      const component = config.componentMap[key];
      const renderComponent = component.render();
      return (
        <div class="editor-block" style={blockStyle.value}>
          {renderComponent}
        </div>
      );
    };
  },
});
