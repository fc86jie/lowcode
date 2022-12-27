/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-19 16:52:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-27 20:27:21
 * @FilePath: \src\packages\editor-menu.tsx
 * @Description:
 */

import { defineComponent } from 'vue';
import { ElIcon, ElButton } from 'element-plus';
import {
  Download,
  RefreshLeft,
  RefreshRight,
  Upload,
  Top,
  Bottom,
  Delete,
  Edit,
  Promotion,
} from '@element-plus/icons-vue';
import { useCommand } from './useCommand';
import { $dialog } from '@/components/dialog';
import { editorKey, IChangeEditorData } from '@/inter';

export default defineComponent({
  props: {
    preview: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['setPreview'],
  setup(props, { emit }) {
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
      {
        label: '置顶',
        icon: <Top />,
        handler: () => {
          commands.placeTop();
        },
      },
      {
        label: '置底',
        icon: <Bottom />,
        handler: () => {
          commands.placeBottom();
        },
      },
      {
        label: '删除',
        icon: <Delete />,
        handler: () => {
          commands.del();
        },
      },
      {
        label: () => (props.preview ? '编辑' : '预览'),
        icon: () => (props.preview ? <Edit /> : <Promotion />),
        handler: () => {
          emit('setPreview', !props.preview);
        },
      },
    ];

    return () => {
      return buttons.map(({ label, icon, handler }) => {
        return (
          <ElButton type="primary" onClick={handler}>
            <ElIcon style="vertical-align: middle">{typeof icon === 'function' ? icon() : icon}</ElIcon>
            <span style="vertical-align: middle">{typeof label === 'function' ? label() : label}</span>
          </ElButton>
        );
      });
    };
  },
});
