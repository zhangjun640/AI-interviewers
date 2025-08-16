<template>
  <a-collapse class="education-collapse">
    <a-collapse-panel key="1" header="教育经历">
      <a-space direction="vertical" style="width: 100%">
        <!-- 教育经历列表 -->
        <div v-for="(edu, index) in education" :key="index" class="education-item">
          <div class="item-header">
            <h4>教育经历 #{{ index + 1 }}</h4>
            <a-popconfirm title="确定要删除当前教育经历？" ok-text="删除" cancel-text="取消" @confirm="removeEducation(edu.id)">
              <template #icon><question-circle-outlined style="color: red" /></template>
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </div>

          <a-form layout="vertical">
            <a-row gutter="24">
              <a-col :span="12">
                <a-input v-model:value="edu.school" placeholder="请输入学校名称" addonBefore="学校" />
              </a-col>
              <a-col :span="12">
                <a-input v-model:value="edu.major" placeholder="请输入专业" addonBefore="专业" />
              </a-col>
            </a-row>

            <a-row gutter="24" style="margin-top: 16px">
              <a-col :span="12">
                <a-date-picker v-model:value="edu.startDate" placeholder="开始时间" style="width: 100%" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </a-col>
              <a-col :span="12">
                <a-date-picker v-model:value="edu.endDate" placeholder="结束时间" style="width: 100%" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" />
              </a-col>
            </a-row>

            <a-input v-model:value="edu.degree" placeholder="请输入学位" addonBefore="学位" style="margin-top: 16px" />
          </a-form>
          <a-divider v-if="index !== education.length - 1" />
        </div>

        <!-- 添加按钮 -->
        <a-button type="dashed" block @click="addEducation" style="margin-top: 16px">
          <plus-outlined /> 添加教育经历
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
const resumeStore = useResumeStore();
const education = computed(() => resumeStore.education);

// 添加教育经历
const addEducation = () => {
  resumeStore.addEducation({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: ''
  });
};

// 删除教育经历
const removeEducation = (id: number) => {
  resumeStore.deleteEducation(id)
  message.success('教育经历删除成功！');
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
.education-collapse {
  margin: 20px auto 0;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
}

.education-item {
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