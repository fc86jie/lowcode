/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 14:37:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-19 12:22:17
 * @FilePath: \src\packages\useFocus.ts
 * @Description: 获取被选中的block
 */

import { IEditor, IEditorBlock } from '@/inter';
import { computed, ref, WritableComputedRef } from 'vue';

export function useFocus(data: WritableComputedRef<IEditor>, callback: Function) {
  // 最后选中的索引
  let lastSelectedIndex = ref<number>(-1);
  // 最后选中的block
  let lastSelectedBlock = computed(() => {
    let index = lastSelectedIndex.value;
    return index >= 0 ? data.value.blocks[index] : null;
  });
  // 清除所有焦点
  const clearBlockFocus = () => {
    data.value.blocks.forEach(block => (block.focus = false));
  };
  // 点击容器
  const containerMousedown = () => {
    clearBlockFocus();
    lastSelectedIndex.value = -1;
  };
  const blockMousedown = (e: MouseEvent, block: IEditorBlock, index: number) => {
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

    // 记录最后选中的block索引
    if (block.focus) {
      lastSelectedIndex.value = index;
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
    containerMousedown,
    blockMousedown,
    focusData,
    lastSelectedBlock,
  };
}
