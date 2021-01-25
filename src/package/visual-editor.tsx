import { computed, defineComponent, PropType, ref } from 'vue'
import {
  VisualEditorModelValue,
  VisualEditorConfig,
  VisualEditorComponent,
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

    const containerRef = ref({} as HTMLDivElement)

    const containerStyles = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`,
    }))

    const menuDraggier = {
      current: {
        component: null as null | VisualEditorComponent,
      },
      dragStart: (e: DragEvent, component: VisualEditorComponent) => {
        containerRef.value.addEventListener('dragenter', menuDraggier.dragEnter)
        containerRef.value.addEventListener('dragover', menuDraggier.dragOver)
        containerRef.value.addEventListener('dragleave', menuDraggier.dragLeave)
        containerRef.value.addEventListener('drop', menuDraggier.drop)
        menuDraggier.current.component = component
      },
      dragEnter: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move'
      },
      drag: (e: DragEvent) => {
        e.preventDefault()
      },
      dragOver: (e: DragEvent) => {
        e.preventDefault()
      },
      dragLeave: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none'
      },
      dragEnd: (e: DragEvent) => {
        containerRef.value.removeEventListener(
          'dragenter',
          menuDraggier.dragEnter
        )
        containerRef.value.removeEventListener(
          'dragover',
          menuDraggier.dragOver
        )
        containerRef.value.removeEventListener(
          'dragleave',
          menuDraggier.dragLeave
        )
        containerRef.value.removeEventListener('drop', menuDraggier.drop)
        menuDraggier.current.component = null
      },
      drop: (e: DragEvent) => {
        console.log('drop', menuDraggier.current.component)
        const blocks = dataModel.value.blocks || []
        blocks.push({
          top: e.offsetY,
          left: e.offsetX,
        })
        dataModel.value = { ...dataModel.value, blocks }
      },
    }

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          {props.config.componentList.map((component) => (
            <div
              class="visual-editor-menu-item"
              draggable
              onDragend={menuDraggier.dragEnd}
              onDragstart={(e) => menuDraggier.dragStart(e, component)}
            >
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
            <div
              class="visual-editor-container"
              style={containerStyles.value}
              ref={containerRef}
            >
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
