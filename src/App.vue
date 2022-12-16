<script setup lang="ts">
import { ref } from 'vue';
import Editor from './packages/editor';
import data from './data.json';
const state = ref(data);
</script>

<template>
  <div class="app">
    <Editor v-model="state"></Editor>
  </div>
</template>

<style lang="scss" scoped></style>
