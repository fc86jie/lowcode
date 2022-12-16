/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 20:23:05
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-16 10:19:44
 * @FilePath: \src\inter.ts
 * @Description:
 */

// 组件接口定义
export interface IEditorBlock {
  left: number;
  top: number;
  zIndex: number;
  key: string;
}

// 编辑器配置文件接口定义
export interface IEditor {
  container: {
    width: number;
    height: number;
  };
  blocks: Array<IEditorBlock>;
}
