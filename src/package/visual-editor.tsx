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

    const menuDraggier = (() => {
      let component = null as null | VisualEditorComponent

      const blockHandler = {
        /**
         * 处理拖拽菜单开始动作
         * @param e
         * @param current
         */
        dragStart: (e: DragEvent, current: VisualEditorComponent) => {
          containerRef.value.addEventListener(
            'dragenter',
            containerHandler.dragEnter
          )
          containerRef.value.addEventListener(
            'dragover',
            containerHandler.dragOver
          )
          containerRef.value.addEventListener(
            'dragleave',
            containerHandler.dragLeave
          )
          containerRef.value.addEventListener('drop', containerHandler.drop)
          component = current
        },
        /**
         * 处理菜单拖拽结束动作
         * @param e
         */
        dragEnd: (e: DragEvent) => {
          containerRef.value.removeEventListener(
            'dragenter',
            containerHandler.dragEnter
          )
          containerRef.value.removeEventListener(
            'dragover',
            containerHandler.dragOver
          )
          containerRef.value.removeEventListener(
            'dragleave',
            containerHandler.dragLeave
          )
          containerRef.value.removeEventListener('drop', containerHandler.drop)
          component = null
        },
      }

      const containerHandler = {
        /**
         * 拖拽菜单组件，进入容器的时候，设置鼠标为可放置状态
         * @param e
         */
        dragEnter: (e: DragEvent) => {
          e.dataTransfer!.dropEffect = 'move'
        },
        /**
         * 拖拽菜单组件，鼠标在容器中移动的时候，禁用默认事件
         * @param e
         */
        dragOver: (e: DragEvent) => {
          e.preventDefault()
        },
        /**
         * 如果拖拽过程中，鼠标离开了容器，设置鼠标为不可放置的状态
         * @param e
         */
        dragLeave: (e: DragEvent) => {
          e.dataTransfer!.dropEffect = 'none'
        },
        /**
         * 在子容器中放置的时候，设置事件对象的offsetX和offsetY添加一条组件数据
         * @param e
         */
        drop: (e: DragEvent) => {
          console.log('drop', component)
          const blocks = dataModel.value.blocks || []
          blocks.push({
            top: e.offsetY,
            left: e.offsetX,
          })
          dataModel.value = { ...dataModel.value, blocks }
        },
      }
      return blockHandler
    })()

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
