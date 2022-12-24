/*
 * @Author: wangrenjie86@gmail.com
 * @Date: 2022-12-24 16:01:26
 * @LastEditors: wangrenjie86@gmail.com
 * @LastEditTime: 2022-12-24 16:14:34
 * @FilePath: \src\packages\events.ts
 * @Description:
 */

import mitt from 'mitt';

type Events = {
  start?: string;
  end?: string;
};

export const emitter = mitt<Events>();
