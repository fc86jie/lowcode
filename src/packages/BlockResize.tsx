/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2023-01-02 20:43:36
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 21:56:42
 * @FilePath: \src\packages\BlockResize.tsx
 * @Description:
 */

import { PropType } from 'vue';
import { IComponent, IEditorBlock } from '@/inter';
import './BlockResize.scss';

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<IEditorBlock>,
      required: true,
    },
    component: {
      type: Object as PropType<IComponent>,
      required: true,
    },
  },
  setup(props) {
    const { width, height } = props.component.resize || {};
    let data = {
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startLeft: 0,
      startTop: 0,
      h: 'start',
      v: 'start',
    };
    const onMousemove = (e: MouseEvent) => {
      let { clientX, clientY } = e;
      let { startX, startY, startWidth, startHeight, startLeft, startTop, h, v } = data;

      // 只修改纵向
      if (h === 'center') {
        clientX = startX;
      }
      // 只修改横向
      if (v === 'center') {
        clientY = startY;
      }

      let durX = clientX - startX;
      let durY = clientY - startY;

      if (h === 'start') {
        durX = -durX;
        props.block.left = startLeft - durX;
      }

      if (v === 'start') {
        durY = -durY;
        props.block.top = startTop - durY;
      }

      const width = startWidth + durX;
      const height = startHeight + durY;

      props.block.width = width;
      props.block.height = height;
      props.block.hasResize = true;
    };
    const onMouseup = (e: MouseEvent) => {
      document.body.removeEventListener('mousemove', onMousemove);
      document.body.removeEventListener('mouseup', onMouseup);
    };
    const onMousedown = (
      e: MouseEvent,
      {
        h,
        v,
      }: {
        h: 'start' | 'center' | 'end';
        v: 'start' | 'center' | 'end';
      }
    ) => {
      // 阻止默认行为
      e.stopPropagation();
      data = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width as number,
        startHeight: props.block.height as number,
        startLeft: props.block.left,
        startTop: props.block.top,
        h,
        v,
      };

      document.body.addEventListener('mousemove', onMousemove);
      document.body.addEventListener('mouseup', onMouseup);
    };
    return () => (
      <>
        {width && (
          <>
            <div
              class="block-resize block-resize-left"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'start',
                  v: 'center',
                })
              }
            ></div>
            <div
              class="block-resize block-resize-right"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'end',
                  v: 'center',
                })
              }
            ></div>
          </>
        )}
        {height && (
          <>
            <div
              class="block-resize block-resize-top"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'center',
                  v: 'start',
                })
              }
            ></div>
            <div
              class="block-resize block-resize-bottom"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'center',
                  v: 'end',
                })
              }
            ></div>
          </>
        )}
        {width && height && (
          <>
            <div
              class="block-resize block-resize-top-left"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'start',
                  v: 'start',
                })
              }
            ></div>
            <div
              class="block-resize block-resize-top-right"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'end',
                  v: 'start',
                })
              }
            ></div>
            <div
              class="block-resize block-resize-bottom-left"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'start',
                  v: 'end',
                })
              }
            ></div>
            <div
              class="block-resize block-resize-bottom-right"
              onMousedown={e =>
                onMousedown(e, {
                  h: 'end',
                  v: 'end',
                })
              }
            ></div>
          </>
        )}
      </>
    );
  },
});
