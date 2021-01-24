<template>
  <div class="app">
    <h1>这个是页面内容</h1>
    <visual-editor v-model="jsonData" :config="visualConfig"></visual-editor>
    <!-- <test-use-model v-model="val"></test-use-model> -->
    val: {{ val }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VisualEditor } from '@/package/visual-editor'
import { visualConfig } from '@/package/visual-config'
// import { TestUseModel } from '@/package/utils/useModel'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor,
    // TestUseModel,
  },
  data() {
    return {
      visualConfig,
      jsonData: {
        container: {
          height: 500,
          width: 800,
        },
        blocks: [
          {
            top: 100,
            left: 100,
          },
          {
            top: 200,
            left: 200,
          },
        ],
      },
    }
  },
})
</script>

<style lang="scss"></style>
