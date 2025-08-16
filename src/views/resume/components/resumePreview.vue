<template>

  <div class="setting">
    <!-- 弹框模板设置 -->
    <a-button type="primary" @click="resumeSettingClick" style="margin-right: 10px;">简历设置</a-button>
    <a-modal v-model:open="open" title="简历基本设置">
      <template #footer>
        <a-button key="submit" type="primary" @click="resumeSettingClickOK">确定</a-button>
      </template>
      <!-- 选择模板 -->
      <a-form-item label="简历模板选择" name="简历模板选择">
        <a-select v-model:value="currentTemplate" @change="handleTemplateChange" style="width: 150px;">
          <a-select-option v-for="item in templates" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 设置简历主色调-->
      <a-form-item label="简历主色调" name="简历主色调">
        <input id="themeColor1" class="changeColor" type="color" v-model="resumeSetting.themeColor1"
          @change="(e) => themeColor1 = ((e.target as HTMLInputElement).value)" />
      </a-form-item>
      <!-- 设置简历副色调 -->
      <a-form-item label="简历副色调" name="简历副色调">
        <input id="themeColor2" class="changeColor" type="color" v-model="resumeSetting.themeColor2"
          @change="(e) => themeColor2 = (e.target as HTMLInputElement).value" />
      </a-form-item>
      <!-- 设置字体大小 -->
      <a-form-item label="字体大小" name="字体大小">
        <a-slider v-model:value="fontSize" :min="12" :max="24" />
      </a-form-item>
      <!-- 设置段落间距 -->
      <a-form-item label="段落间距" name="段落间距">
        <a-slider v-model:value="paragraphSpacing" :min="0" :max="30" />
      </a-form-item>
      <!-- 设置区块间距 -->
      <a-form-item label="区块间距" name="区块间距">
        <a-slider v-model:value="sectionSpacing" :min="0" :max="30" />
      </a-form-item>
      <!-- 设置左右页边距 -->
      <a-form-item label="左右页边距" name="左右页边距">
        <a-slider v-model:value="padding_left_right" :min="0" :max="65" />
      </a-form-item>
      <!-- 设置上下页边距 -->
      <a-form-item label="上下页边距" name="上下页边距">
        <a-slider v-model:value="padding_top_bottom" :min="0" :max="35" />
      </a-form-item>
    </a-modal>

    <a-button type="primary" @click="exportToPDF" id="export-button">导出PDF</a-button>
  </div>
  <div class="preview" ref="resumePreview" @mousedown="startDragging" @wheel.prevent="handleZoom">
    <div class="resume-content" :style="contentStyle">
      <!-- 动态渲染当前选中的模板组件 -->
      <component :is="currentComponent" :colorShades="colorShades" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch, defineAsyncComponent, type ComponentOptions } from "vue";
import { getTemplates } from "../../../utils/getTemplates";
import type { Template } from "../../../types/template";
import { useResumeStore } from "../../../store";
import { generateColorShades } from "../../../utils/colorUtils";
import html2pdf from "html2pdf.js";
import { createApp } from 'vue';
import { storeToRefs } from 'pinia'
import { message } from "ant-design-vue";
// 主题色部分功能
const resumeStore = useResumeStore();
const { resumeSetting } = storeToRefs(resumeStore);
const themeColor1 = computed({
  get: () => resumeSetting.value.themeColor1,
  set: (val) => resumeStore.updateResumeSetting({ themeColor1: val })
})
const themeColor2 = computed({
  get: () => resumeSetting.value.themeColor2,
  set: (val) => resumeStore.updateResumeSetting({ themeColor2: val })
});
const fontSize = computed({
  get: () => resumeSetting.value.fontSize,
  set: (val) => resumeStore.updateResumeSetting({ fontSize: val })
})

const sectionSpacing = computed({
  get: () => resumeSetting.value.sectionSpacing,
  set: (val) => resumeStore.updateResumeSetting({ sectionSpacing: val })
})

const paragraphSpacing = computed({
  get: () => resumeSetting.value.paragraphSpacing,
  set: (val) => resumeStore.updateResumeSetting({ paragraphSpacing: val })
})
// 当前选中的模板ID
const currentTemplate = computed({
  get: () => resumeSetting.value.currentTemplate,
  set: (val) => resumeStore.updateResumeSetting({ currentTemplate: val })
})
// 左右页边距
const padding_left_right = computed({
  get: () => resumeSetting.value.padding_left_right,
  set: (val) => resumeStore.updateResumeSetting({ padding_left_right: val })
})
//  上下页边距
const padding_top_bottom = computed({
  get: () => resumeSetting.value.padding_top_bottom,
  set: (val) => resumeStore.updateResumeSetting({ padding_top_bottom: val })
})
// 生成的色阶对象
const colorShades = ref(generateColorShades(resumeSetting.value.themeColor1));

// 多模板切换部分功能
// 动态导入所有模板组件
const templateModules = import.meta.glob('../../../template/**/index.vue');
// 模板列表
const templates = ref<Template[]>([]);
// 当前渲染的组件
const currentComponent = ref();

onMounted(async () => {
  try {
    templates.value = await getTemplates();
    // 如果有已选中的模板，则恢复
    if (currentTemplate.value) {
      loadCurrentTemplate();
    } else {
      // 如果没有已选中的模板，则默认选中第一个
      currentTemplate.value = templates.value[0].id;
      loadCurrentTemplate();
    }
  } catch (error) {
    console.error('获取模板列表失败:', error);
  }
});

// 监听当前简历模板的变化，以加载对应的组件
watch(currentTemplate, (newId) => {
  handleTemplateChange(newId);
});

// 处理模板切换
const handleTemplateChange = (id: String | null) => {
  if (!id) return;
  const selectedTemplate = templates.value.find(t => t.id === id);
  if (selectedTemplate) {
    currentTemplate.value = selectedTemplate.id;
    loadCurrentTemplate();
  }
};

// 加载当前选中的模板组件
const loadCurrentTemplate = () => {
  const selectedTemplate = templates.value.find(t => t.id === currentTemplate.value);
  if (selectedTemplate?.folderPath) {
    const folderName = selectedTemplate.folderPath;
    if (!folderName) {
      console.error('模板路径错误:', selectedTemplate.folderPath);
      currentTemplate.value = templates.value[0].id;
      loadCurrentTemplate();
      return;
    }
    const importPath = `../../../template/${folderName}/index.vue`;
    const importFunc = templateModules[importPath];
    if (importFunc) {
      currentComponent.value = defineAsyncComponent(() => importFunc() as Promise<typeof import('*.vue')['default']>);
    } else {
      currentTemplate.value = templates.value[0].id;
      loadCurrentTemplate();
      console.error(`未找到路径为 ${importPath} 的组件`);
    }
  }
};

// 弹框
let open = ref(false);
const resumeSettingClick = () => {
  open.value = true;
}

const resumeSettingClickOK = () => {
  open.value = false;
  message.success('设置成功');
}

// 导出简历为 PDF
const exportToPDF = async () => {
  await nextTick();
  // 创建一个新的容器来渲染简历内容
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.top = "-9999px"; // 隐藏容器
  document.body.appendChild(tempContainer);

  const content = document.createElement("div");
  content.classList.add("resume-content");

  // 渲染当前模板的内容
  const selectedTemplate = templates.value.find(t => t.id === currentTemplate.value);
  if (selectedTemplate?.folderPath) {
    const importPath = `../../../template/${selectedTemplate.folderPath}/index.vue`;
    const importFunc = templateModules[importPath];

    if (importFunc) {
      const { default: Component } = await importFunc() as { default: ComponentOptions };
      const app = createApp(Component, {
        colorShades: colorShades.value,
      });
      // 挂载组件
      app.mount(content);
      tempContainer.appendChild(content);
      await nextTick();
      const options = {
        filename: "resume.pdf",
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(content).set(options).save().finally(() => {
        // 清理临时容器
        document.body.removeChild(tempContainer);
      });
    } else {
      console.error(`未找到路径为 ${importPath} 的组件`);
    }

  }
};


// 简历预览拖拽事件功能
// 初始化函数，在组件挂载时调用
onMounted(() => {
  updateBounds();
  window.addEventListener("resize", updateBounds);
});
// 获取预览容器的引用
const resumePreview = ref<HTMLElement | null>(null);

// 定义拖拽和缩放的状态
const state = reactive({
  scale: 0.6,           // 当前缩放比例
  translateX: 0,      // 当前水平位移
  translateY: 0,      // 当前垂直位移
  dragging: false,    // 是否正在拖拽
  startX: 0,          // 拖拽起始的鼠标X坐标
  startY: 0,          // 拖拽起始的鼠标Y坐标
  previewWidth: 0,    // 预览容器宽度
  previewHeight: 0,   // 预览容器高度
  contentWidth: 0,    // 内容宽度
  contentHeight: 0,   // 内容高度
});

// 初始化预览和内容尺寸
const updateBounds = async () => {
  await nextTick(); // 确保 DOM 已更新
  if (resumePreview.value) {
    const container = resumePreview.value;
    const content = container.querySelector(".resume-content") as HTMLElement;
    if (content) {
      state.previewWidth = container.clientWidth;
      state.previewHeight = container.clientHeight;
      state.contentWidth = content.offsetWidth;
      state.contentHeight = content.offsetHeight;

      limitTranslation();
    }
  }
};

// 缩放处理函数
const handleZoom = (event: WheelEvent) => {
  const zoomSpeed = 0.1; // 缩放速度
  const oldScale = state.scale; // 记录旧的缩放比例

  if (event.deltaY < 0) {
    // 放大，限制最大缩放比例为3倍
    state.scale = Math.min(state.scale + zoomSpeed, 3);
  } else {
    // 缩小，限制最小缩放比例为0.2倍
    state.scale = Math.max(state.scale - zoomSpeed, 0.2);
  }

  // 计算鼠标在容器中的位置偏移
  const rect = resumePreview.value?.getBoundingClientRect();
  if (rect) {
    const offsetX = event.clientX - rect.left - rect.width / 2 - state.translateX;
    const offsetY = event.clientY - rect.top - rect.height / 2 - state.translateY;
    // 根据新的缩放比例调整位移，保持缩放中心在鼠标位置
    state.translateX -= (offsetX / oldScale) * (state.scale - oldScale);
    state.translateY -= (offsetY / oldScale) * (state.scale - oldScale);
  }

  // 更新内容尺寸和预览尺寸
  updateBounds();
};

// 限制拖动范围，确保至少 10% 的内容在预览区域内
const limitTranslation = () => {
  // 计算缩放后的内容尺寸
  const scaledContentWidth = state.contentWidth * state.scale;
  const scaledContentHeight = state.contentHeight * state.scale;

  // 计算至少 10% 的内容需要保持可见
  const minVisibleX = scaledContentWidth * 0.1 / 2;
  const minVisibleY = scaledContentHeight * 0.1 / 2;

  // 计算预览容器的边界
  const previewLeft = -state.previewWidth / 1.2 + minVisibleX;
  const previewRight = state.previewWidth / 1.2 - minVisibleX;
  const previewTop = -state.previewHeight / 1.2 + minVisibleY;
  const previewBottom = state.previewHeight / 1.2 - minVisibleY;

  // 确保平移不会超过边界
  state.translateX = Math.min(previewRight, Math.max(state.translateX, previewLeft));
  state.translateY = Math.min(previewBottom, Math.max(state.translateY, previewTop));
};

// 开始拖拽
const startDragging = (event: MouseEvent) => {
  event.preventDefault(); // 防止选中文本等行为
  state.dragging = true;
  state.startX = event.pageX - state.translateX;
  state.startY = event.pageY - state.translateY;

  // 绑定全局的鼠标移动和松开事件
  document.addEventListener("mousemove", onDragging);
  document.addEventListener("mouseup", stopDragging);
};

// 拖拽中
const onDragging = (event: MouseEvent) => {
  if (state.dragging) {
    // 更新位移
    state.translateX = event.pageX - state.startX;
    state.translateY = event.pageY - state.startY;
    // 限制位移范围
    limitTranslation();
  }
};

// 停止拖拽
const stopDragging = () => {
  state.dragging = false;
  limitTranslation();
  // 移除全局的鼠标移动和松开事件
  document.removeEventListener("mousemove", onDragging);
  document.removeEventListener("mouseup", stopDragging);
};

// .resume-content 容器样式
const contentStyle = computed(() => ({
  // 应用平移和缩放
  transform: `translate(-50%, -50%) translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`,
  // 设置缩放中心为内容中心
  transformOrigin: "center center",
  // 拖拽时改变鼠标样式
  cursor: state.dragging ? "grabbing" : "grab",
  // 提升性能
  willChange: "transform",
  // 平滑过渡效果
  transition: state.dragging ? "none" : "transform 0.2s ease",
}));



// 组件销毁前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBounds);
});
</script>

<style scoped>
/* 导入外部css */
@import '../styles/styles.css';
</style>
