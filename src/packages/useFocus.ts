/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 14:37:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-18 19:56:58
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
    if (block.focus) {
      block.focus = false;
    } else {
      // 如果按住了shift说明是多选，否则清空其它的
      if (!e.shiftKey) {
        clearBlockFocus();
      }
      block.focus = true;
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
