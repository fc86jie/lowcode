/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-18 14:37:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-27 20:35:01
 * @FilePath: \src\packages\useFocus.ts
 * @Description: 获取被选中的block
 */

import { IEditor, IEditorBlock } from '@/inter';
import { computed, Ref, ref, WritableComputedRef } from 'vue';

export function useFocus(
  data: WritableComputedRef<IEditor>,
  previewRef: Ref<boolean>,
  callback: (e: MouseEvent) => void
) {
  // 选中的索引列表，选中push进去，反选shift掉
  let selectedIndex = ref<Array<number>>([]);
  // 最后选中的block
  let lastSelectedBlock = computed(() => {
    let list = selectedIndex.value;
    let len = list.length;
    return len > 0 ? data.value.blocks[list[len - 1]] : null;
  });
  // 清除所有焦点
  const clearBlockFocus = () => {
    data.value.blocks.forEach(block => (block.focus = false));
  };
  // 点击容器
  const containerMousedown = () => {
    if (previewRef.value) {
      return;
    }
    clearBlockFocus();
    selectedIndex.value = [];
  };
  const blockMousedown = (e: MouseEvent, block: IEditorBlock, index: number) => {
    if (previewRef.value) {
      return;
    }
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
    let idx = selectedIndex.value.indexOf(index);
    if (block.focus) {
      selectedIndex.value.push(index);
    } else {
      // 可能是按住shift之后的二次点击，这时候要移除掉
      selectedIndex.value.splice(idx, 1);
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
    clearBlockFocus,
  };
}
