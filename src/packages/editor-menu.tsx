/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-19 16:52:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-24 22:39:47
 * @FilePath: \src\packages\editor-menu.tsx
 * @Description:
 */

import { defineComponent, PropType } from 'vue';
import { ElIcon, ElButton } from 'element-plus';
import { RefreshLeft, RefreshRight } from '@element-plus/icons-vue';
import { useCommand } from './useCommand';
import { IEditor } from '@/inter';

export default defineComponent({
  components: {
    ElIcon,
    ElButton,
    RefreshLeft,
    RefreshRight,
  },
  setup(props, { emit }) {
    const { commands } = useCommand();
    const buttons = [
      {
        label: '撤销',
        icon: <RefreshLeft />,
        handler: () => {
          commands.undo();
        },
      },
      {
        label: '重做',
        icon: <RefreshRight />,
        handler: () => {
          commands.redo();
        },
      },
    ];
    return () => {
      return buttons.map(button => {
        return (
          <ElButton type="primary" onClick={button.handler}>
            <ElIcon style="vertical-align: middle">{button.icon}</ElIcon>
            <span style="vertical-align: middle">{button.label}</span>
          </ElButton>
        );
      });
    };
  },
});
