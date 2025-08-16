<template>
  <a-collapse class="project-collapse" accordion>
    <a-collapse-panel key="1" header="项目经历">
      <a-space direction="vertical" style="width: 100%">
        <!-- 项目经历列表 -->
        <div v-for="(project, index) in projects" :key="project.id" class="project-item">
          <div class="item-header">
            <h4>项目经历 #{{ index + 1 }}</h4>
            <a-popconfirm title="确定要删除当前项目经历？" ok-text="删除" cancel-text="取消" @confirm="removeProject(project.id)">
              <template #icon><question-circle-outlined style="color: red" /></template>
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </div>

          <a-form layout="vertical">
            <a-row gutter="24">
              <a-col :span="12">
                <a-input v-model:value="project.projectName" placeholder="请输入项目名称" addon-before="项目名称" />
              </a-col>
              <a-col :span="12">
                <a-input v-model:value="project.role" placeholder="请输入您的角色" addon-before="角色" />
              </a-col>
            </a-row>

            <a-row gutter="24" style="margin-top: 16px">
              <a-col :span="12">
                <a-date-picker v-model:value="project.startDate" placeholder="开始时间" style="width: 100%"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </a-col>
              <a-col :span="12">
                <a-date-picker v-model:value="project.endDate" placeholder="结束时间" style="width: 100%"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
              </a-col>
            </a-row>
            <!-- 项目简介 -->
            <AIEnhancePopover :description="`请帮我润色和优化以下内容，是我简历中的项目简介
                    使其更加简洁、专业和吸引面试官，不用md语法，
                    层次清晰分明：${project.briefIntroduction}`" :extend="`下面这个是我简历中的过往项目简介，我可以从哪些方面扩展优化？给我一些思路：
                    \n${project.briefIntroduction}`"
              @update="(content: string) => project.briefIntroduction = content">
              <a-textarea v-model:value="project.briefIntroduction" placeholder="请输入项目简介" addon-before="项目简介" rows="4"
                style="margin-top: 16px" />
            </AIEnhancePopover>

            <AIEnhancePopover :description="`请帮我润色和优化以下内容，是我简历中的项目要点，
                    使其更加简洁、专业和吸引面试官，
                    你返回的内容换行表示一个要点，不用md语法，不要隔行，
                    层次清晰分明：\n${project.description}`" :extend="`下面这个是我简历中的项目要点，我可以从哪些方面扩展优化？你的回复用文本就行，不需要md语法，给我一些思路：
                    \n${project.description}`" @update="(content: string) => project.description = content">
              <a-textarea v-model:value="project.description" placeholder="请输入项目描述" addon-before="描述" rows="4"
                style="margin-top: 16px" />
            </AIEnhancePopover>
          </a-form>
          <a-divider v-if="index !== projects.length - 1" />
        </div>

        <!-- 添加按钮 -->
        <a-button type="dashed" block @click="addProject" style="margin-top: 16px">
          <PlusOutlined /> 添加项目经历
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
const projects = computed(() => resumeStore.projects);

// 添加项目经历
const addProject = () => {
  resumeStore.addProject({
    projectName: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    briefIntroduction: '',
  });
};

// 删除项目经历
const removeProject = (id: number) => {
  resumeStore.deleteProject(id);
  message.success('项目经历删除成功！');
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
.project-collapse {
  margin: 20px auto 0;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
}

.project-item {
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
