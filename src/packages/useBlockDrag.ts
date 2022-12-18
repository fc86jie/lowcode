/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 20:14:00
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-18 20:19:48
 * @FilePath: \src\packages\useBlockDrag.ts
 * @Description:
 */

import { IEditorBlock } from '@/inter';
import { ComputedRef } from 'vue';

export function useBlockDrag(
  focusData: ComputedRef<{
    focus: IEditorBlock[];
    unFocus: IEditorBlock[];
  }>
) {
  type dragStateType = {
    startX: number;
    startY: number;
    startPos: Array<{ left: number; top: number }>;
  };

  let dragState: dragStateType = {
    startX: 0,
    startY: 0,
    startPos: [],
  };

  const mousedown = (e: MouseEvent) => {
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({ left, top }) => ({ left, top })),
    };
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };
  const mousemove = (e: MouseEvent) => {
    let durX = e.clientX - dragState.startX;
    let durY = e.clientY - dragState.startY;
    focusData.value.focus.forEach((item, index) => {
      item.left = dragState.startPos[index].left + durX;
      item.top = dragState.startPos[index].top + durY;
    });
  };
  const mouseup = (e: MouseEvent) => {
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  return {
    mousedown,
  };
}
