/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-16 10:10:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-28 19:36:06
 * @FilePath: \src\packages\editor-block.tsx
 * @Description:
 */

import { $dialog } from '@/components/Dialog';
import { $dropdown, DropdownItem } from '@/components/Dropdown';
import { Bottom, Delete, Promotion, Top, Upload } from '@element-plus/icons-vue';
import { computed, defineComponent, inject, onMounted, PropType, ref } from 'vue';
import { IEditorBlock, IEditorConfig, configKey } from '../inter';
import './editor-block.scss';
import { useCommand } from './useCommand';

export default defineComponent({
  props: {
    block: {
      type: Object as PropType<IEditorBlock>,
      required: true,
    },
  },
  emits: ['alignCenter', 'setStyle'],
  setup(props, { emit }) {
    // props解构会失去响应
    // 获取根据block配置获取样式
    const blockStyle = computed(() => ({
      left: `${props.block.left}px`,
      top: `${props.block.top}px`,
      zIndex: props.block.zIndex,
    }));

    const config = inject(configKey) as IEditorConfig;

    const blockRef = ref<HTMLDivElement | null>(null);

    const { commands } = useCommand();

    // 右键菜单快捷键
    const onContextMenuBlock = (e: MouseEvent) => {
      // 阻止默认右键菜单
      e.preventDefault();
      // 此处如果使用target可能会到会定位出错，比如点击的是按钮的文字，就会相对于文字定位
      $dropdown({
        el: e.currentTarget as HTMLElement,
        content: (
          <>
            <DropdownItem label="删除" icon={<Delete />} onClick={() => commands.del()}></DropdownItem>
            <DropdownItem label="置顶" icon={<Top />} onClick={() => commands.placeTop()}></DropdownItem>
            <DropdownItem label="置底" icon={<Bottom />} onClick={() => commands.placeBottom()}></DropdownItem>
            <DropdownItem
              label="查看"
              icon={<Promotion />}
              onClick={() => {
                $dialog({
                  title: '查看节点数据',
                  content: JSON.stringify(props.block),
                });
              }}
            ></DropdownItem>
            <DropdownItem
              label="导入"
              icon={<Upload />}
              onClick={() => {
                $dialog({
                  title: '导入节点数据',
                  content: '',
                  footer: true,
                  onConfirm(newVal) {
                    let data = JSON.parse(newVal);
                    commands.updateBlock(data, props.block);
                  },
                });
              }}
            ></DropdownItem>
          </>
        ),
      });
    };

    onMounted(() => {
      // 拖拽之放下之后需要居中，默认是放置到鼠标的左上角了
      const { offsetWidth, offsetHeight } = blockRef.value as HTMLDivElement;
      if (props.block.alignCenter) {
        emit('alignCenter', {
          left: props.block.left - offsetWidth / 2,
          top: props.block.top - offsetHeight / 2,
          alignCenter: false,
        });
      }
      emit('setStyle', {
        width: offsetWidth,
        height: offsetHeight,
      });
    });

    return () => {
      const component = config.componentMap[props.block.key];
      const renderComponent = component.render();
      return (
        <div
          class="editor-block"
          style={blockStyle.value}
          ref={blockRef}
          onContextmenu={(e: MouseEvent) => onContextMenuBlock(e)}
        >
          {renderComponent}
        </div>
      );
    };
  },
});
