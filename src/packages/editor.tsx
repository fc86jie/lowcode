/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 19:45:31
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-28 10:33:03
 * @FilePath: \src\packages\editor.tsx
 * @Description:
 */

import { computed, defineComponent, PropType, inject, ref, provide } from 'vue';
import { ElButton } from 'element-plus';
import deepcopy from 'deepcopy';
import EditorBlock from './editor-block';
import EditorMenu from './editor-menu';
import { IEditor, configKey, IEditorConfig, IEditorBlock, editorKey, focusKey } from '@/inter';
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
    // 是否处于预览状态
    let previewRef = ref(false);
    // 是否处于编辑状态
    let editorRef = ref(true);

    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        emit('update:modelValue', deepcopy(newValue));
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
    const { blockMousedown, containerMousedown, focusData, lastSelectedBlock, clearBlockFocus } = useFocus(
      data,
      previewRef,
      (e: MouseEvent) => {
        mousedown(e);
      }
    );

    // 3、拖拽元素
    const { mousedown, markLine } = useBlockDrag(focusData, lastSelectedBlock, data);

    // 更新block数据
    const updateBlock: <T>(styleData: T, index: number) => void = (styleData, index) => {
      let { blocks } = data.value;
      blocks[index] = { ...blocks[index], ...styleData };
      data.value = { ...data.value, blocks: [...blocks] };
    };

    // 初始渲染居中block
    const onAlignCenter = (styleData: Pick<IEditorBlock, 'left' | 'top' | 'alignCenter'>, index: number) => {
      updateBlock(styleData, index);
    };

    // 渲染完成设置宽高
    const onSetStyle = (styleData: Pick<IEditorBlock, 'width' | 'height'>, index: number) => {
      updateBlock(styleData, index);
    };

    // 设置是否预览
    const onSetPreview = (preview: boolean) => {
      previewRef.value = preview;
      // 清除辅助线
      clearBlockFocus();
    };

    // 设置是否编辑
    const onSetEditor = (state: boolean) => {
      editorRef.value = state;
      // 清除辅助线
      clearBlockFocus();
    };

    // 注入数据
    provide(editorKey, {
      getData() {
        return data.value;
      },
      setBlockData(blocks: Array<IEditorBlock>) {
        data.value = { ...data.value, blocks };
      },
      setData(newData: IEditor) {
        data.value = { ...newData };
      },
    });

    provide(focusKey, {
      getFocusData() {
        return focusData.value;
      },
    });

    return () =>
      editorRef.value ? (
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
            <div class="editor-top">
              <EditorMenu preview={previewRef.value} onSetPreview={onSetPreview} onSetEditor={onSetEditor}></EditorMenu>
            </div>
            <div class="editor-container">
              {/* 滚动条 */}
              <div class="editor-container-canvas">
                {/* 内容区 */}
                <div
                  class="editor-container-canvas__content"
                  style={containerStyle.value}
                  ref={containerRef}
                  onMousedown={containerMousedown}
                >
                  {data.value.blocks.map((block, index) => (
                    // jsx绑定的事件名称前面加上on，事件名改为驼峰命名法并且首字母大写，拼接上前面的on即可绑定自定义事件
                    <EditorBlock
                      class={[block.focus ? 'editor-block-focus' : '', previewRef ? 'editor-block-preview' : '']}
                      block={block}
                      onAlignCenter={data => onAlignCenter(data, index)}
                      onSetStyle={data => onSetStyle(data, index)}
                      onMousedown={(e: MouseEvent) => blockMousedown(e, block, index)}
                    ></EditorBlock>
                  ))}
                  {/* 横向辅助线 */}
                  {markLine.y !== null && <div class="line-x" style={{ top: `${markLine.y}px` }}></div>}
                  {/* 纵向辅助线 */}
                  {markLine.x !== null && <div class="line-y" style={{ left: `${markLine.x}px` }}></div>}
                </div>
              </div>
            </div>
          </div>
          <div class="editor-right">属性控制栏</div>
        </div>
      ) : (
        <>
          <div class="editor-container-canvas__content" style={containerStyle.value}>
            {data.value.blocks.map((block, index) => (
              <EditorBlock class="editor-block-preview" block={block}></EditorBlock>
            ))}
          </div>
          <div>
            <ElButton type="primary" onClick={() => onSetEditor(true)}>
              继续编辑
            </ElButton>
          </div>
        </>
      );
  },
});
