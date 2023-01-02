[1mdiff --git a/src/inter.ts b/src/inter.ts[m
[1mindex 431e194..cc6ef3e 100644[m
[1m--- a/src/inter.ts[m
[1m+++ b/src/inter.ts[m
[36m@@ -2,7 +2,7 @@[m
  * @Author: wangrenjie86@gmail.com[m
  * @Date: 2022-12-14 20:23:05[m
  * @LastEditors: wangrenjie86@gmail.com[m
[31m- * @LastEditTime: 2023-01-01 20:06:54[m
[32m+[m[32m * @LastEditTime: 2023-01-01 20:53:58[m
  * @FilePath: \src\inter.ts[m
  * @Description:[m
  */[m
[36m@@ -92,6 +92,17 @@[m [mexport interface IComponent {[m
       type: 'color';[m
       label: string;[m
     };[m
[32m+[m[32m    options?: {[m
[32m+[m[32m      type: 'table';[m
[32m+[m[32m      label: string;[m
[32m+[m[32m      table: {[m
[32m+[m[32m        options: Array<{[m
[32m+[m[32m          label: string;[m
[32m+[m[32m          field: string;[m
[32m+[m[32m        }>;[m
[32m+[m[32m        key: string;[m
[32m+[m[32m      };[m
[32m+[m[32m    };[m
   };[m
   model?: {[m
     [key: string]: string;[m
[1mdiff --git a/src/packages/EditorOperator.tsx b/src/packages/EditorOperator.tsx[m
[1mindex 3f47a11..2a83f20 100644[m
[1m--- a/src/packages/EditorOperator.tsx[m
[1m+++ b/src/packages/EditorOperator.tsx[m
[36m@@ -2,7 +2,7 @@[m
  * @Author: wangrenjie86@gmail.com[m
  * @Date: 2022-12-29 12:04:50[m
  * @LastEditors: wangrenjie86@gmail.com[m
[31m- * @LastEditTime: 2023-01-01 19:59:19[m
[32m+[m[32m * @LastEditTime: 2023-01-01 21:01:11[m
  * @FilePath: \src\packages\EditorOperator.tsx[m
  * @Description:[m
  */[m
[36m@@ -78,7 +78,7 @@[m [mexport default defineComponent({[m
       } else {[m
         let component = config.componentMap[props.block.key];[m
         if (component && component.props) {[m
[31m-          type TPropName = 'text' | 'color' | 'size' | 'type';[m
[32m+[m[32m          type TPropName = 'text' | 'color' | 'size' | 'type' | 'fontSize';[m
           content.push([m
             Object.entries(component.props).map(([propName, propConfig]) => {[m
               return ([m
[36m@@ -105,6 +105,7 @@[m [mexport default defineComponent({[m
                         ))}[m
                       </ElSelect>[m
                     ),[m
[32m+[m[32m                    table: () => <div></div>,[m
                   }[propConfig.type]()}[m
                 </ElFormItem>[m
               );[m
[1mdiff --git a/src/utils/editor-config.tsx b/src/utils/editor-config.tsx[m
[1mindex e0134e3..fee437c 100644[m
[1m--- a/src/utils/editor-config.tsx[m
[1m+++ b/src/utils/editor-config.tsx[m
[36m@@ -2,13 +2,13 @@[m
  * @Author: wangrenjie86@gmail.com[m
  * @Date: 2022-12-16 14:19:49[m
  * @LastEditors: wangrenjie86@gmail.com[m
[31m- * @LastEditTime: 2023-01-01 19:57:40[m
[32m+[m[32m * @LastEditTime: 2023-01-01 20:52:16[m
  * @FilePath: \src\utils\editor-config.tsx[m
  * @Description:[m
  */[m
 [m
 import { IComponent, IEditorConfig } from '@/inter';[m
[31m-import { ElButton, ElInput } from 'element-plus';[m
[32m+[m[32mimport { ElButton, ElInput, ElSelect } from 'element-plus';[m
 import Range from '@/components/Range';[m
 [m
 function createEditorConfig(): IEditorConfig {[m
[36m@@ -162,3 +162,32 @@[m [meditorConfig.registry({[m
     end: '结束范围字段',[m
   },[m
 });[m
[32m+[m
[32m+[m[32meditorConfig.registry({[m
[32m+[m[32m  key: 'select',[m
[32m+[m[32m  label: '下拉框',[m
[32m+[m[32m  preview: () => <ElSelect placeholder="输入框预览" />,[m
[32m+[m[32m  render: ({ model }) => <ElSelect placeholder="输入框渲染" {...model.default} />,[m
[32m+[m[32m  props: {[m
[32m+[m[32m    options: {[m
[32m+[m[32m      type: 'table',[m
[32m+[m[32m      label: '下拉选项',[m
[32m+[m[32m      table: {[m
[32m+[m[32m        options: [[m
[32m+[m[32m          {[m
[32m+[m[32m            label: '显示值',[m
[32m+[m[32m            field: 'label',[m
[32m+[m[32m          },[m
[32m+[m[32m          {[m
[32m+[m[32m            label: '绑定值',[m
[32m+[m[32m            field: 'value',[m
[32m+[m[32m          },[m
[32m+[m[32m        ],[m
[32m+[m[32m        key: 'label', // 显示给用户的值是label值[m
[32m+[m[32m      },[m
[32m+[m[32m    },[m
[32m+[m[32m  },[m
[32m+[m[32m  model: {[m
[32m+[m[32m    default: '绑定字段',[m
[32m+[m[32m  },[m
[32m+[m[32m});[m
