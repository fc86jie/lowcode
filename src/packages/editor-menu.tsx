/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-19 16:52:16
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-19 17:17:24
 * @FilePath: \src\packages\editor-menu.tsx
 * @Description:
 */

import { defineComponent } from 'vue';
import { ElIcon, ElButton } from 'element-plus';
import { RefreshLeft, Refresh } from '@element-plus/icons-vue';

export default defineComponent({
  components: {
    ElIcon,
    ElButton,
    RefreshLeft,
    Refresh,
  },
  // props: {
  // block: {
  //   type: Object as PropType<IEditorBlock>,
  //   required: true,
  // },
  // },
  emits: [],
  setup(props, { emit }) {
    const buttons = [
      {
        label: '撤销',
        icon: <RefreshLeft />,
        handler: () => {
          console.log('撤销');
        },
      },
      {
        label: '重做',
        icon: <Refresh />,
        handler: () => {
          console.log('重做');
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
