/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-19 16:52:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-27 13:58:02
 * @FilePath: \src\packages\editor-menu.tsx
 * @Description:
 */

import { defineComponent } from 'vue';
import { ElIcon, ElButton } from 'element-plus';
import { Download, RefreshLeft, RefreshRight, Upload } from '@element-plus/icons-vue';
import { useCommand } from './useCommand';
import { $dialog } from '@/components/dialog';
import { editorKey, IChangeEditorData } from '@/inter';

export default defineComponent({
  setup() {
    let { getData } = inject(editorKey) as IChangeEditorData;
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
          // commands.redo();
          $dialog({
            title: '导出JSON使用',
            content: JSON.stringify(getData()),
          });
        },
      },
      {
        label: '导入',
        icon: <Upload />,
        handler: () => {
          $dialog({
            title: '导入JSON使用',
            content: '',
            footer: true,
            onConfirm(newVal) {
              let data = JSON.parse(newVal);
              commands.updateContainer(data);
            },
          });
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
