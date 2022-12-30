/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 20:23:05
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-30 21:34:43
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
  props: {
    text?: string;
    color?: string;
    fontSize?: string;
    size?: '' | 'large' | 'small' | 'default';
    type?: '' | 'text' | 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'info';
  };
  model?: {
    [key: string]: Object;
  };
}

export interface IEditorContainer {
  width: number;
  height: number;
}

// 编辑器配置文件接口定义
export interface IEditor {
  container: IEditorContainer;
  blocks: Array<IEditorBlock>;
}

// 配置文件

export interface IOption {
  label: string;
  value: string | number;
}

export interface IComponent {
  key: string;
  label: string;
  preview: () => JSX.Element | string;
  render: (data: {
    props: {
      text?: string;
      type?: '' | 'text' | 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'info';
      color?: string;
      fontSize?: string;
      size?: '' | 'large' | 'small' | 'default';
    };
    model: {
      [key: string]: Object;
    };
  }) => JSX.Element | string;
  props: {
    text?: {
      type: 'input';
      label: string;
    };
    type?: {
      type: 'select';
      label: string;
      options: Array<IOption>;
    };
    fontSize?: {
      type: 'select';
      label: string;
      options: Array<IOption>;
    };
    size?: {
      type: 'select';
      label: string;
      options: Array<IOption>;
    };
    color?: {
      type: 'color';
      label: string;
    };
  };
  model?: {
    [key: string]: Object;
  };
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

export interface IFocusData {
  getFocusData: () => {
    focus: Array<IEditorBlock>;
    unFocus: Array<IEditorBlock>;
  };
}

export const configKey = Symbol('editor-config') as InjectionKey<IEditorConfig>;
export const editorKey = Symbol('editor-data') as InjectionKey<IChangeEditorData>;
export const focusKey = Symbol('focus-data') as InjectionKey<IFocusData>;
