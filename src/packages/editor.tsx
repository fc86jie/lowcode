/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 19:45:31
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-16 21:15:58
 * @FilePath: \src\packages\editor.tsx
 * @Description:
 */

import { computed, defineComponent, PropType, inject } from 'vue';
import EditorBlock from './editor-block';
import { IEditor, configKey, IEditorConfig } from '@/inter';
import './editor.scss';

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<IEditor>,
      required: true,
    },
  },
  setup(props) {
    const data = computed({
      get() {
        return props.modelValue;
      },
      set() {},
    });

    // 获取容器样式
    const containerStyle = computed(() => ({
      width: `${data.value.container.width}px`,
      height: `${data.value.container.height}px`,
    }));

    const config = inject(configKey) as IEditorConfig;

    return () => (
      <div class="editor">
        <div class="editor-left">
          {config.componentList.map(item => (
            <div class="editor-left-item">
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
              <div class="editor-container-canvas__content" style={containerStyle.value}>
                {data.value.blocks.map(block => (
                  <EditorBlock block={block}></EditorBlock>
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
