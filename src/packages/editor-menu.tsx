/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-19 16:52:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-26 19:36:18
 * @FilePath: \src\packages\editor-menu.tsx
 * @Description:
 */

import { defineComponent } from 'vue';
import { ElIcon, ElButton } from 'element-plus';
import { Download, RefreshLeft, RefreshRight, Upload } from '@element-plus/icons-vue';
import { useCommand } from './useCommand';

export default defineComponent({
  setup() {
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
      {
        label: '导出',
        icon: <Download />,
        handler: () => {
          commands.redo();
        },
      },
      {
        label: '导入',
        icon: <Upload />,
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
