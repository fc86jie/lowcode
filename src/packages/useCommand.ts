import { onUnmounted, inject } from 'vue';
import deepcopy from 'deepcopy';
import { IEditor, editorKey, IChangeEditorData, IEditorBlock, focusKey, IFocusData } from '@/inter';
import { emitter } from './events';

export function useCommand() {
  interface ICommand {
    name: string;
    pushQueue?: boolean; // 是否要放入队列中
    keyboard?: string; // 快捷键
    init?: () => () => void; // 初始化
    execute: (data?: any[]) => { redo: () => void; undo?: () => void };
    before?: null | object;
  }

  interface IState {
    current: number;
    queue: Array<{ redo: () => void; undo: () => void }>;
    commands: {
      [key: string]: (...rest: any[]) => void;
    };
    commandList: Array<ICommand>;
    destroyList: Array<() => void>;
  }

  const state: IState = {
    current: -1, // 前进后退指针
    queue: [], // 所有操作命令
    commands: {}, // 命令和执行功能映射
    commandList: [], // 存放所有命令
    destroyList: [], // 销毁事件
  };

  const registry = (command: ICommand) => {
    state.commandList.push(command);
    state.commands[command.name] = (...args: any[]) => {
      const { redo, undo } = command.execute(...args);
      redo();
      if (!command.pushQueue) {
        return;
      }
      let { queue, current } = state;
      // 在放置的过程中可能有撤销操作，根据当前最新的current值来计算新的队列
      // 组件1 -》组件2-》组件3-》撤销-》撤销-》组件4 === 组件1=》组件4
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1);
        state.queue = queue;
      }
      // 保存指令的前进、后退
      queue.push({
        redo,
        undo: undo as () => void,
      });
      state.current = current + 1;
    };
  };

  let { getData, setBlockData, setData } = inject(editorKey) as IChangeEditorData;
  let { getFocusData } = inject(focusKey) as IFocusData;

  // 注册需要的命令
  // 下一步
  registry({
    name: 'redo',
    keyboard: 'ctrl+y',
    execute() {
      return {
        redo() {
          // 找到当前的下一步还原，前进
          let item = state.queue[state.current + 1];
          if (item) {
            item.redo && item.redo();
            state.current++;
          }
        },
      };
    },
  });

  // 上一步
  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    execute() {
      return {
        redo() {
          if (state.current === -1) {
            return;
          }
          // 找到当前的上一步还原，后退
          let item = state.queue[state.current];
          if (item) {
            item.undo && item.undo();
            state.current--;
          }
        },
      };
    },
  });

  registry({
    name: 'drag',
    pushQueue: true,
    init() {
      this.before = null;
      // 监控拖拽开始事件，保存状态
      const start = () => {
        let { blocks } = getData();
        this.before = deepcopy(blocks);
      };
      // 拖拽之后触发对应指令
      const end = () => state.commands.drag();
      emitter.on('start', start);
      emitter.on('end', end);
      return () => {
        emitter.off('start', start);
        emitter.off('end', end);
      };
    },
    execute() {
      let before = this.before;
      let { blocks } = getData();
      let after = blocks;
      return {
        redo() {
          setBlockData(after);
        },
        undo() {
          setBlockData(before as Array<IEditorBlock>);
        },
      };
    },
  });

  // 导入后可回退
  registry({
    name: 'updateContainer',
    pushQueue: true,
    execute(newVal) {
      let before = getData();
      let after = newVal;
      return {
        redo() {
          setData(after as unknown as IEditor);
        },
        undo() {
          setData(before);
        },
      };
    },
  });

  // 置顶
  registry({
    name: 'placeTop',
    pushQueue: true,
    execute() {
      let { blocks } = getData();
      let before = deepcopy(blocks);
      let after = (() => {
        let { focus, unFocus } = getFocusData();
        let maxZIndex = unFocus.reduce((prev, { zIndex }) => {
          return Math.max(prev, zIndex);
        }, -Infinity);

        focus.forEach(block => (block.zIndex = maxZIndex + 1));

        return getData().blocks;
      })();
      return {
        redo() {
          setBlockData(after);
        },
        undo() {
          setBlockData(before);
        },
      };
    },
  });

  // 置底
  registry({
    name: 'placeBottom',
    pushQueue: true,
    execute() {
      let { blocks } = getData();
      let before = deepcopy(blocks);
      let after = (() => {
        let { focus, unFocus } = getFocusData();
        let minZIndex =
          unFocus.reduce((prev, { zIndex }) => {
            return Math.min(prev, zIndex);
          }, Infinity) - 1;

        // 负的直接赋值会导致元素被放置到容器的下面，导致不可见。让unFocus的zIndex增加，focus的zIndex为0即可
        if (minZIndex < 0) {
          const dur = Math.abs(minZIndex);
          minZIndex = 0;
          unFocus.forEach(block => (block.zIndex += dur));
        }

        focus.forEach(block => (block.zIndex = minZIndex));

        return getData().blocks;
      })();
      return {
        redo() {
          setBlockData(after);
        },
        undo() {
          setBlockData(before);
        },
      };
    },
  });

  // 删除
  registry({
    name: 'del',
    pushQueue: true,
    execute() {
      let { blocks } = getData();
      let { unFocus } = getFocusData();
      let before = deepcopy(blocks);
      let after = unFocus;

      return {
        redo() {
          setBlockData(after);
        },
        undo() {
          setBlockData(before);
        },
      };
    },
  });

  // 快捷键
  const keyboradEvents = (() => {
    const onKeydown = (e: KeyboardEvent) => {
      const { ctrlKey, code } = e;
      let keyStrArray = [];
      if (ctrlKey) {
        keyStrArray.push('ctrl');
      }

      if (code === 'KeyY') {
        keyStrArray.push('y');
      } else if (code === 'KeyZ') {
        keyStrArray.push('z');
      }

      let keyStr = keyStrArray.join('+');

      state.commandList.forEach(({ name, keyboard }) => {
        if (!keyboard) return;
        if (keyboard === keyStr) {
          state.commands[name]();
          e.preventDefault();
        }
      });
    };
    const init = () => {
      window.addEventListener('keydown', onKeydown);
      return () => {
        window.removeEventListener('keydown', onKeydown);
      };
    };

    return init;
  })();

  // 初始化
  (() => {
    state.destroyList.push(keyboradEvents());
    state.commandList.forEach(command => command.init && state.destroyList.push(command.init()));
  })();

  // 销毁事件
  onUnmounted(() => {
    state.destroyList.forEach(fn => fn && fn());
  });

  return state;
}
