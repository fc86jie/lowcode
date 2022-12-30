<script setup lang="ts">
import { provide, ref } from 'vue';
import Editor from '@/packages/Editor';
import data from './data.json';
import { editorConfig } from '@/utils/editor-config';
import { configKey } from './inter';

provide(configKey, editorConfig);

const state = ref(data);
</script>

<template>
  <div class="app">
    <Editor v-model="state"></Editor>
  </div>
</template>

<style lang="scss" scoped></style>
