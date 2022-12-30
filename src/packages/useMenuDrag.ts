/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-17 23:37:55
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-30 20:26:03
 * @FilePath: \src\packages\useMenuDrag.ts
 * @Description: 菜单拖拽
 */

import { IComponent, IEditor } from '@/inter';
import { Ref, WritableComputedRef } from 'vue';
import { emitter } from './events';

export function useMenuDrag(data: WritableComputedRef<IEditor>, containerRef: Ref<HTMLDivElement | null>) {
  let curComp: IComponent | null = null;

  const dragEnter = (e: DragEvent) => {
    e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
  };

  const dragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const dragLeave = (e: DragEvent) => {
    e.dataTransfer && (e.dataTransfer.dropEffect = 'none');
  };

  const drop = (e: DragEvent) => {
    let { blocks } = data.value;
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          left: e.offsetX,
          top: e.offsetY,
          zIndex: 1,
          key: (curComp as IComponent).key,
          alignCenter: true,
          props: {},
          model: {},
        },
      ],
    };
  };

  const dragStart = (e: DragEvent, component: IComponent) => {
    containerRef.value?.addEventListener('dragenter', dragEnter);
    containerRef.value?.addEventListener('dragover', dragOver);
    containerRef.value?.addEventListener('dragleave', dragLeave);
    containerRef.value?.addEventListener('drop', drop);
    curComp = component;
    emitter.emit('start');
  };

  const dragEnd = () => {
    containerRef.value?.removeEventListener('dragenter', dragEnter);
    containerRef.value?.removeEventListener('dragover', dragOver);
    containerRef.value?.removeEventListener('dragleave', dragLeave);
    containerRef.value?.removeEventListener('drop', drop);
    curComp = null;
    emitter.emit('end');
  };

  return {
    dragStart,
    dragEnd,
  };
}
