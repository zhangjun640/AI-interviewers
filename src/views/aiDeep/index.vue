<script setup lang="ts">
// import { ref } from 'vue';
import { ref, provide } from "vue";
import userInput from './components/userInput.vue';
import AIChat from './components/AIChat.vue';
import type { TourProps } from 'ant-design-vue';

//子组件之间通信 jd 以及 简历数据
const resumeProject = ref<string>("");
const jd = ref<string>("");

defineOptions({
  name: "aiDeep"  // keep-alive需要
});


provide("resumeProject", resumeProject);
provide("jd", jd);

//引导开始
const left = ref(null);
const right = ref(null);
const aiChatRef = ref<InstanceType<typeof AIChat> | null>(null);
const inputRef = ref<InstanceType<typeof userInput> | null>(null);
const tourOpen = ref(false);
const tourSteps: TourProps['steps'] = [
  {
    title: "输入信息",
    description: "第一步：在侧边输入需要深度优化或者面试的内容。",
    target: () => right.value,
    placement: "left",
    nextButtonProps: { children: () => "下一步" },
  },
  {
    title: "选择方式",
    description: "第二步：选择“经历深挖”或“模拟面试”",
    target: () => aiChatRef.value?.$el.querySelector("#ai-choose-content") as HTMLElement,
    placement: "bottom",
    prevButtonProps: { children: () => "上一步" },
    nextButtonProps: { children: () => "下一步" },
  },
  {
    title: "开始对话",
    description: "第三步：开始和AI对话",
    target: () => aiChatRef.value?.$el.querySelector("#ai-chat-content") as HTMLElement,
    placement: "top",
    prevButtonProps: { children: () => "上一步" },
    nextButtonProps: { children: () => "下一步" },
  },
  {
    title: "经历修改",
    description: "最后：“经历深挖”模式下，AI会自动修改您的经历帮您优化！您只需要给建议即可",
    target: () => inputRef.value?.$el.querySelector("#input-value") as HTMLElement,
    placement: "left",
    prevButtonProps: { children: () => "上一步" },
    nextButtonProps: { children: () => "关闭" },
  }
];
// 引导完成时回调关闭引导
const handleFinish = () => {
  tourOpen.value = false;
};

const beginTour = () => {
  tourOpen.value = true;
};
provide("beginTour", beginTour);
</script>

<template>
  <div class="main-box">
    <div class="left" ref="left">
      <AIChat ref="aiChatRef" />
    </div>
    <div class="right" ref="right">
      <userInput ref="inputRef" />
    </div>
  </div>

  <!-- 漫游式引导 -->
  <a-tour v-model:open="tourOpen" arrow="true" :steps="tourSteps" :mask="true" :prev-button-props="{ children: '上一步' }"
    :finish-button-props="{ children: '完成' }" @finish="handleFinish" @close="handleFinish" />
</template>

<style scoped>
.main-box {
  border-radius: 20px;

  background-color: var(--bg-card-color);
  margin: 30px auto;
  box-shadow: 0 2px 17px 0 rgba(53, 53, 53, 0.1);
  padding: 5px;
  display: flex;
  max-width: 80vw;
  height: 85vh;
}

.left {
  flex: 1;
  padding: 10px;
}

.right {
  /* display: flex;
  flex-direction: column; */
  width: 30%;
  min-width: 250px;
}
</style>
