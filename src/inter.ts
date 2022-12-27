/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 20:23:05
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-27 11:43:46
 * @FilePath: \src\inter.ts
 * @Description:
 */

import type { InjectionKey } from 'vue';

// 组件接口定义
export interface IEditorBlock {
  left: number;
  top: number;
  zIndex: number;
  key: string;
  alignCenter?: boolean;
  focus?: boolean;
  width?: number;
  height?: number;
}

// 编辑器配置文件接口定义
export interface IEditor {
  container: {
    width: number;
    height: number;
  };
  blocks: Array<IEditorBlock>;
}

// 配置文件

export interface IComponent {
  key: string;
  label: string;
  preview: () => JSX.Element | string;
  render: () => JSX.Element | string;
}
export interface IEditorConfig {
  componentList: Array<IComponent>;
  componentMap: { [key: string]: IComponent };
  registry: (component: IComponent) => void;
}

export interface IChangeEditorData {
  getData: () => IEditor;
  setBlockData: (blocks: Array<IEditorBlock>) => void;
  setData: (data: IEditor) => void;
}

export const configKey = Symbol('editor-config') as InjectionKey<IEditorConfig>;
export const editorKey = Symbol('editor-data') as InjectionKey<IChangeEditorData>;
