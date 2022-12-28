/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-27 12:05:54
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-28 19:02:04
 * @FilePath: \src\components\Dropdown.tsx
 * @Description:
 */

import { ElIcon } from 'element-plus';
import {
  createVNode,
  defineComponent,
  PropType,
  render,
  RendererElement,
  RendererNode,
  VNode,
  onMounted,
  onBeforeMount,
  Component,
  provide,
  inject,
} from 'vue';
import './Dropdown.scss';

interface IOptions {
  el: HTMLElement;
  content: JSX.Element;
}

const DropdownComponent = defineComponent({
  props: {
    options: {
      type: Object as PropType<IOptions>,
      required: true,
    },
  },
  setup(props, { expose }) {
    const state = reactive<{ options: IOptions; isShow: boolean; top: number; left: number }>({
      options: props.options,
      isShow: false,
      top: 0,
      left: 0,
    });

    const classes = computed(() => [
      'dropdown',
      {
        'dropdown-isShow': state.isShow,
      },
    ]);

    const styles = computed(() => ({
      left: `${state.left}px`,
      top: `${state.top}px`,
    }));

    const el = ref<HTMLElement | null>(null);

    const onMousedown = (e: MouseEvent) => {
      if (el.value && !el.value.contains(e.target as Node)) {
        state.isShow = false;
      }
    };

    onMounted(() => {
      document.body.addEventListener('mousedown', onMousedown, true);
    });

    onBeforeMount(() => {
      document.body.removeEventListener('mousedown', onMousedown);
    });

    expose({
      showDropdown(options: IOptions) {
        state.options = options;
        state.isShow = true;
        let { left, top, height } = options.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;
      },
    });

    provide('hide', () => {
      state.isShow = false;
    });

    return () => {
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {state.options.content}
        </div>
      );
    };
  },
});

export const DropdownItem = defineComponent({
  props: {
    label: {
      type: String,
    },
    icon: {
      type: Object as PropType<Component>,
    },
  },
  setup(props) {
    let { label, icon } = props;
    let hide: ((payload: MouseEvent) => void) | undefined = inject('hide');
    return () => (
      <div class="dropdown-item" onClick={hide}>
        <ElIcon style="vertical-align: middle">{icon}</ElIcon>
        <span style="vertical-align: middle">{label}</span>
      </div>
    );
  },
});

let vn: VNode<RendererNode, RendererElement, { [key: string]: any }> | null;
export function $dropdown(options: IOptions) {
  let el = document.createElement('div');
  // 没有创建新的，有复用
  if (!vn) {
    vn = createVNode(DropdownComponent, { options });
    render(vn, el);
    document.body.appendChild(el);
  }

  // 获取组件内部暴露的方法供调用
  let exposedCtx = vn.component?.exposed;
  exposedCtx?.showDropdown(options);
}
