<template>
  <a-collapse class="skills-collapse">
    <a-collapse-panel key="1" header="专业技能">
      <a-space direction="vertical" style="width: 100%">
        <!-- 技能列表 -->
        <div v-for="(skill, index) in skills" :key="index" class="skill-item">
          <div class="item-header">
            <h4>技能 #{{ index + 1 }}</h4>
            <a-popconfirm title="确定要删除当前技能？" ok-text="删除" cancel-text="取消" @confirm="removeSkill(skill.id)">
              <template #icon><question-circle-outlined style="color: red" /></template>
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </div>

          <a-form layout="vertical">
            <AIEnhancePopover :description="`请帮我润色和优化以下内容，是我简历中的技能描述，
                    使其更加简洁、专业和吸引面试官，不要多余的文字说明：\n${skill.skillName}`" :extend="`下面这个是我简历中的技能描述，我可以从哪些方面扩展优化？你的回复用文本就行，不需要md语法，给我一些思路：
                    \n${skill.skillName}`" @update="(content: string) => skill.skillName = content">
              <a-input v-model:value="skill.skillName" placeholder="请输入技能名称" addonBefore="技能" />
            </AIEnhancePopover>


          </a-form>
          <a-divider v-if="index !== skills.length - 1" />
        </div>

        <!-- 添加按钮 -->
        <a-button type="dashed" block @click="addSkill" style="margin-top: 16px">
          <plus-outlined /> 添加技能
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
const skills = computed(() => resumeStore.skills);

// 添加技能
const addSkill = () => {
  resumeStore.addSkill({
    skillName: ''
  });
};

// 删除技能
const removeSkill = (id: number) => {
  resumeStore.deleteSkill(id)
  message.success('技能删除成功！');
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
.skills-collapse {
  margin: 20px auto 0;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
}

.skill-item {
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