import { computed, defineComponent, PropType } from 'vue'
import {
  VisualEditorModelValue,
  VisualEditorConfig,
} from './visual-editor-type'

import './visual-editor.scss'
import { useModel } from './utils/useModel'
import { VisualEditorBlock } from './visual-editor-block'

export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true,
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
      required: true,
    },
  },
  emits: {
    'update:modelValue': (val?: VisualEditorModelValue) => true,
  },
  setup(props, ctx) {
    const dataModel = useModel(
      () => props.modelValue,
      (val) => ctx.emit('update:modelValue', val)
    )

    const containerStyles = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`,
    }))

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          {props.config.componentList.map((component) => (
            <div class="visual-editor-menu-item">
              <span class="visual-editor-menu-item-label">
                {component.label}
              </span>
              {component.preview()}
            </div>
          ))}
        </div>
        <div class="visual-editor-header">visual-editor-menu</div>
        <div class="visual-editor-operator">visual-editor-operator</div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div class="visual-editor-container" style={containerStyles.value}>
              {dataModel.value.blocks &&
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock
                    block={block}
                    key={index}
                  ></VisualEditorBlock>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
})
