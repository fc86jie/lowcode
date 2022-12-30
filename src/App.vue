<script setup lang="ts">
import { provide, ref } from 'vue';
import Editor from '@/packages/Editor';
import data from './data.json';
import { editorConfig } from '@/utils/editor-config';
import { configKey, IEditor } from './inter';

provide(configKey, editorConfig);

const state = ref<IEditor>(data as IEditor);

const formData = ref({
  username: '放糖的茶',
  password: '123456',
});
</script>

<template>
  <div class="app">
    <Editor v-model="state" :formData="formData"></Editor>
  </div>
</template>

<style lang="scss" scoped></style>
