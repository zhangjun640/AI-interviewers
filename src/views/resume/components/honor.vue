<template>
  <a-collapse class="honors-collapse">
    <a-collapse-panel key="1" header="荣誉奖项">
      <a-space direction="vertical" style="width: 100%">
        <!-- 荣誉列表 -->
        <div v-for="(honor, index) in honors" :key="index" class="honor-item">
          <div class="item-header">
            <h4>荣誉 #{{ index + 1 }}</h4>
            <a-popconfirm title="确定要删除当前荣誉奖项？" ok-text="删除" cancel-text="取消" @confirm="removeHonor(honor.id)">
              <template #icon><question-circle-outlined style="color: red" /></template>
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </div>

          <a-form layout="vertical">
            <a-row gutter="24">
              <a-col :span="12">
                <a-input v-model:value="honor.honorName" placeholder="请输入奖项名称" addonBefore="奖项" />
              </a-col>
              <a-col :span="12">
                <a-date-picker v-model:value="honor.date" placeholder="获奖时间" style="width: 100%" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </a-col>
            </a-row>
            <AIEnhancePopover :description="`请帮我润色和优化以下内容，是我简历中的获奖描述，
                    使其更加简洁、专业和吸引面试官，
                    你返回的内容换行表示一个要点，不用md语法，不要隔行，
                    层次清晰分明：\n${honor.description}`" :extend="`下面这个是我简历中的获奖描述，我可以从哪些方面扩展优化？你的回复用文本就行，不需要md语法，给我一些思路：
                    \n${honor.description}`" @update="(content: string) => honor.description = content">
              <a-textarea v-model:value="honor.description" placeholder="请输入奖项描述"
                :auto-size="{ minRows: 2, maxRows: 5 }" style="margin-top: 16px" />
            </AIEnhancePopover>
          </a-form>
          <a-divider v-if="index !== honors.length - 1" />
        </div>

        <!-- 添加按钮 -->
        <a-button type="dashed" block @click="addHonor" style="margin-top: 16px">
          <plus-outlined /> 添加荣誉奖项
        </a-button>
      </a-space>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useResumeStore } from '../../../store';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import AIEnhancePopover from './AIEnhancePopover.vue';
const resumeStore = useResumeStore();
const honors = computed(() => resumeStore.honors);
console.log(honors.value)
// 添加荣誉
const addHonor = () => {
  resumeStore.addHonor({
    honorName: '',
    date: '',
    description: ''
  });
};

// 删除荣誉 - 修正删除方法
const removeHonor = (id: number) => {
  resumeStore.deleteHonor(id)
  message.success('荣誉奖项删除成功！');
};

// 监听变化并保存到 localStorage
watch(
  () => resumeStore.$state,
  () => {
    resumeStore.saveToLocalStorage();
  },
  { deep: true }
);
</script>

<style scoped>
.honors-collapse {
  margin: 20px auto 0;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
}

.honor-item {
  width: 100%;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.item-header h4 {
  margin: 0;
}
</style>