/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 20:14:00
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-24 23:29:31
 * @FilePath: \src\packages\useBlockDrag.ts
 * @Description:
 */

import { ComputedRef, reactive, WritableComputedRef } from 'vue';
import { IEditor, IEditorBlock } from '@/inter';
import { menuItemEmits } from 'element-plus';
import { emitter } from './events';

export function useBlockDrag(
  focusData: ComputedRef<{
    focus: IEditorBlock[];
    unFocus: IEditorBlock[];
  }>,
  lastSelectedBlock: ComputedRef<IEditorBlock | null>,
  data: WritableComputedRef<IEditor>
) {
  type dragStateType = {
    startX: number;
    startY: number;
    startPos: Array<{ left: number; top: number }>;
    startLeft: number;
    startTop: number;
    lines: {
      x: Array<{ showLeft: number; left: number }>;
      y: Array<{ showTop: number; top: number }>;
    };
    dragging: boolean; // 是否是拖拽
  };

  let dragState: dragStateType = {
    startX: 0,
    startY: 0,
    startPos: [],
    startLeft: 0,
    startTop: 0,
    lines: {
      x: [],
      y: [],
    },
    dragging: false,
  };

  interface IMarkLine {
    x: number | null;
    y: number | null;
  }

  // 记录辅助线位置
  let markLine: IMarkLine = reactive({
    x: null,
    y: null,
  });

  const mousedown = (e: MouseEvent) => {
    // 此处肯定有值
    const lastSelectedBlockValue = lastSelectedBlock.value as IEditorBlock;
    const { width, height } = lastSelectedBlockValue;
    const BWidth = width as number;
    const BHeight = height as number;

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({ left, top }) => ({ left, top })),
      startLeft: lastSelectedBlockValue.left, // B元素拖拽前的left
      startTop: lastSelectedBlockValue.top, // B元素拖拽前的top
      lines: (() => {
        // 获取其他未选中的block做辅助线
        const { unFocus } = focusData.value;
        // 计算横线位置用y来存放，计算纵线位置用x来存放
        let lines: {
          x: Array<{ showLeft: number; left: number }>;
          y: Array<{ showTop: number; top: number }>;
        } = {
          x: [],
          y: [],
        };

        // 除了要和未选中的元素对齐还得和容器对齐
        [
          ...unFocus,
          {
            left: 0,
            top: 0,
            width: data.value.container.width,
            height: data.value.container.height,
          },
        ].forEach(block => {
          const { top: ATop, left: ALeft, width, height } = block;
          const AWidth = width as number;
          const AHeight = height as number;
          // 以下辅助线都是A对B的
          // 所有的横向辅助线
          // 顶对顶
          lines.y.push({ showTop: ATop, top: ATop });
          // 顶对底
          lines.y.push({ showTop: ATop, top: ATop - BHeight });
          // 中对中
          lines.y.push({ showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2 });
          // 底对顶
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight });
          // 底对底
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight - BHeight });
          // 所有的纵向辅助线
          // 左对右
          lines.x.push({ showLeft: ALeft, left: ALeft - BWidth });
          // 左对左
          lines.x.push({ showLeft: ALeft, left: ALeft });
          // 中对中
          lines.x.push({
            showLeft: ALeft + AWidth / 2,
            left: ALeft + AWidth / 2 - BWidth / 2,
          });
          // 右对右
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth - BWidth,
          });
          // 右对左
          lines.x.push({
            showLeft: ALeft + AWidth,
            left: ALeft + AWidth,
          });
        });

        return lines;
      })(),
      dragging: false,
    };
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };
  const mousemove = (e: MouseEvent) => {
    if (!dragState.dragging) {
      dragState.dragging = true;
      emitter.emit('start');
    }

    let { clientX: moveX, clientY: moveY } = e;
    // 记录辅助线要展示的位置
    let x: number | null = null;
    let y: number | null = null;
    // 获取当前拖拽元素B的最新位置和lines里面的比较
    const left = moveX - dragState.startX + dragState.startLeft;
    const top = moveY - dragState.startY + dragState.startTop;
    // 计算横线，距离参照物5px的时候显示辅助线
    for (let i = 0; i < dragState.lines.y.length; i++) {
      let { showTop: s, top: t } = dragState.lines.y[i];
      if (Math.abs(t - top) < 5) {
        y = s;
        // 修改moveY快速贴边
        moveY = dragState.startY - dragState.startTop + t;
        break;
      }
    }

    // 计算纵线，距离参照物5px的时候显示辅助线
    for (let i = 0; i < dragState.lines.x.length; i++) {
      let { showLeft: s, left: l } = dragState.lines.x[i];
      if (Math.abs(l - left) < 5) {
        x = s;
        // 修改moveY快速贴边
        moveX = dragState.startX - dragState.startLeft + l;
        break;
      }
    }

    markLine.x = x;
    markLine.y = y;

    // 拖动
    const durX = moveX - dragState.startX;
    const durY = moveY - dragState.startY;
    focusData.value.focus.forEach((item, index) => {
      item.left = dragState.startPos[index].left + durX;
      item.top = dragState.startPos[index].top + durY;
    });
  };
  const mouseup = (e: MouseEvent) => {
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    markLine.x = null;
    markLine.y = null;
    if (dragState.dragging) {
      dragState.dragging = false;
      emitter.emit('end');
    }
  };

  return {
    mousedown,
    markLine,
  };
}
