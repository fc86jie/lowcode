/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 19:45:31
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-18 20:23:30
 * @FilePath: \src\packages\editor.tsx
 * @Description:
 */

import { computed, defineComponent, PropType, inject, ref } from 'vue';
import deepCopy from 'deepcopy';
import EditorBlock from './editor-block';
import { IEditor, configKey, IEditorConfig, IComponent, IEditorBlock } from '@/inter';
import './editor.scss';
import { useMenuDrag } from './useMenuDrag';
import { useFocus } from './useFocus';
import { useBlockDrag } from './useBlockDrag';

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<IEditor>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        emit('update:modelValue', deepCopy(newValue));
      },
    });

    // 获取容器样式
    const containerStyle = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`,
    }));

    const config = inject(configKey) as IEditorConfig;

    const containerRef = ref<HTMLDivElement | null>(null);

    // 1、菜单拖拽
    const { dragStart, dragEnd } = useMenuDrag(data, containerRef);

    // 2、获取焦点，选中后可能直接拖拽
    const { blockMousedown, clearBlockFocus, focusData } = useFocus(data, (e: MouseEvent) => {
      mousedown(e);
    });

    // 3、拖拽多个元素
    const { mousedown } = useBlockDrag(focusData);

    // 居中block
    const onAlignCenter = (styleData: Pick<IEditorBlock, 'left' | 'top' | 'alignCenter'>, index: number) => {
      let { blocks } = data.value;
      blocks[index] = { ...blocks[index], ...styleData };
      data.value = { ...data.value, blocks: [...blocks] };
    };

    return () => (
      <div class="editor">
        <div class="editor-left">
          {config.componentList.map(item => (
            <div draggable class="editor-left-item" onDragstart={e => dragStart(e, item)} onDragend={dragEnd}>
              <span>{item.label}</span>
              <div>{item.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-middle">
          <div class="editor-top">菜单栏</div>
          <div class="editor-container">
            {/* 滚动条 */}
            <div class="editor-container-canvas">
              {/* 内容区 */}
              <div
                class="editor-container-canvas__content"
                style={containerStyle.value}
                ref={containerRef}
                onMousedown={clearBlockFocus}
              >
                {data.value.blocks.map((block, index) => (
                  // jsx绑定的事件名称前面加上on，事件名改为驼峰命名法并且首字母大写，拼接上前面的on即可绑定自定义事件
                  <EditorBlock
                    class={block.focus ? 'block-editor-focus' : ''}
                    block={block}
                    onAlignCenter={data => onAlignCenter(data, index)}
                    onMousedown={(e: MouseEvent) => blockMousedown(e, block)}
                  ></EditorBlock>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div class="editor-right">属性控制栏</div>
      </div>
    );
  },
});
