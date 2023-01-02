/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-14 20:23:05
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2023-01-02 22:03:39
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
  hasResize?: boolean;
  props: {
    text?: string;
    color?: string;
    fontSize?: string;
    size?: '' | 'large' | 'small' | 'default';
    type?: '' | 'text' | 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'info';
    options?: Array<IOption>;
  };
  model?: {
    [key: string]: string;
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
  resize?: {
    width?: boolean;
    height?: boolean;
  };
  preview: () => JSX.Element | string;
  render: (data: {
    props: {
      options?: Array<IOption>;
      text?: string;
      type?: '' | 'text' | 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'info';
      color?: string;
      fontSize?: string;
      size?: '' | 'large' | 'small' | 'default';
    };
    model: {
      [key: string]: {
        modelValue: number | string;
        'onUpdate:modelValue': (v: string | number) => void;
      };
    };
    size?: {
      width?: number;
      height?: number;
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
    options?: {
      type: 'table';
      label: string;
      table: {
        options: Array<{
          label: string;
          value: string;
        }>;
        key: string;
      };
    };
  };
  model?: {
    [key: string]: string;
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
