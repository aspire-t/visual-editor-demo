<template>
  <div class="app">
    <h1>这个是页面内容</h1>
    <visual-editor></visual-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VisualEditor } from '@/package/visual-editor.tsx'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor,
  },
})
</script>

<style lang="scss"></style>
