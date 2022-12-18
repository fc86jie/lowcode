/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 14:37:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-18 20:41:04
 * @FilePath: \src\packages\useFocus.ts
 * @Description: 获取被选中的block
 */

import { IEditor, IEditorBlock } from '@/inter';
import { computed, WritableComputedRef } from 'vue';

export function useFocus(data: WritableComputedRef<IEditor>, callback: Function) {
  // 清除所有焦点
  const clearBlockFocus = () => {
    data.value.blocks.forEach(block => (block.focus = false));
  };
  const blockMousedown = (e: MouseEvent, block: IEditorBlock) => {
    // 阻止input获取焦点
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      // 当只有一个节点选中时，不切换选中状态
      if (focusData.value.focus.length <= 1) {
        block.focus = true;
      } else {
        block.focus = !block.focus;
      }
    } else {
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true;
      }
    }

    callback(e);
  };

  const focusData = computed(() => {
    let focus: Array<IEditorBlock> = [];
    let unFocus: Array<IEditorBlock> = [];
    data.value.blocks.forEach(block => (block.focus ? focus.push(block) : unFocus.push(block)));
    return {
      focus,
      unFocus,
    };
  });

  return {
    clearBlockFocus,
    blockMousedown,
    focusData,
  };
}
