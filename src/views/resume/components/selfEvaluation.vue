<template>
  <a-collapse class="personal-evaluation-collapse">
    <a-collapse-panel key="1" header="个人总结">
      <a-space direction="vertical" style="width: 100%">
        <AIEnhancePopover :description="`请帮我润色和优化以下内容，是我简历中的个人介绍内容，
                    使其更加简洁、专业和吸引面试官，不要多余的文字说明：\n${summary}`" :extend="`下面这个是我简历中的个人介绍内容，我可以从哪些方面扩展优化？你的回复用文本就行，不需要md语法，给我一些思路：
                    \n${summary}`" @update="(content: string) => summary = content">
          <a-textarea v-model:value="summary" placeholder="请输入个人总结" :auto-size="{ minRows: 2, maxRows: 5 }" />
        </AIEnhancePopover>
      </a-space>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useResumeStore } from '../../../store';
import AIEnhancePopover from './AIEnhancePopover.vue';
// 获取 store 实例
const resumeStore = useResumeStore();

// 将 summary 直接绑定为 ref 类型，便于修改
const summary = ref(resumeStore.summary);

// 监听 summary 的变化并保存到 store
watch(summary, (newValue) => {
  resumeStore.summary = newValue;
  resumeStore.saveToLocalStorage();
}, { immediate: true });
</script>

<style scoped>
.personal-evaluation-collapse {
  margin: 0 auto;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
  margin-top: 20px;
}

/* 针对 a-textarea 组件中的 textarea 元素设置 box-sizing */
.ant-input {
  box-sizing: border-box;
  font-family: 'zql';
}
</style>
