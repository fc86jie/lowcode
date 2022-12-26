/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 10:10:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-26 19:37:20
 * @FilePath: \src\packages\editor-block.tsx
 * @Description:
 */

import { computed, defineComponent, inject, onMounted, PropType, ref } from 'vue';
import { IEditorBlock, IEditorConfig, configKey } from '../inter';
import './editor-block.scss';
import { ElButton, ElInput } from 'element-plus';

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<IEditorBlock>,
      required: true,
    },
  },
  emits: ['alignCenter', 'setStyle'],
  setup(props, { emit }) {
    // props解构会失去响应
    // 获取根据block配置获取样式
    const blockStyle = computed(() => ({
      left: `${props.block.left}px`,
      top: `${props.block.top}px`,
      zIndex: props.block.zIndex,
    }));

    const config = inject(configKey) as IEditorConfig;

    const blockRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      // 拖拽之放下之后需要居中，默认是放置到鼠标的左上角了
      const { offsetWidth, offsetHeight } = blockRef.value as HTMLDivElement;
      if (props.block.alignCenter) {
        emit('alignCenter', {
          left: props.block.left - offsetWidth / 2,
          top: props.block.top - offsetHeight / 2,
          alignCenter: false,
        });
      }
      emit('setStyle', {
        width: offsetWidth,
        height: offsetHeight,
      });
    });

    return () => {
      const component = config.componentMap[props.block.key];
      const renderComponent = component.render();
      return (
        <div class="editor-block" style={blockStyle.value} ref={blockRef}>
          {renderComponent}
        </div>
      );
    };
  },
});
