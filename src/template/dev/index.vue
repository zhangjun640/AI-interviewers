<template>
  <!-- 简历容器，使用计算属性绑定所有主题相关的样式变量 -->
  <div class="resume-container" :style="resumeStyle">
    <!-- 个人信息部分 -->
    <div class="personal-info">
      <div class="personal-details">
        <!-- 仅在有值时显示对应的信息行 -->
        <div class="detail-row" v-if="resume.personalInfo.name">
          <span class="label">姓名：</span>
          <span class="value">{{ resume.personalInfo.name }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.gender">
          <span class="label">性别：</span>
          <span class="value">{{ resume.personalInfo.gender }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.age">
          <span class="label">年龄：</span>
          <span class="value">{{ resume.personalInfo.age }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.phone">
          <span class="label">电话：</span>
          <span class="value">{{ resume.personalInfo.phone }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.email">
          <span class="label">邮箱：</span>
          <span class="value">{{ resume.personalInfo.email }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.university">
          <span class="label">学校：</span>
          <span class="value">{{ resume.personalInfo.university }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.major">
          <span class="label">专业：</span>
          <span class="value">{{ resume.personalInfo.major }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.politicalStatus">
          <span class="label">政治面貌：</span>
          <span class="value">{{ resume.personalInfo.politicalStatus }}</span>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.website">
          <span class="label">网站：</span>
          <a :href="resume.personalInfo.website" target="_blank" class="value">{{ resume.personalInfo.website }}</a>
        </div>
      </div>
      <!-- 头像部分，仅在有头像时显示 -->
      <div class="profile-image" v-if="resume.personalInfo.avatar">
        <img :src="resume.personalInfo.avatar" alt="个人照片">
      </div>
    </div>

    <!-- 各个章节的模板结构相似，都包含标题和内容部分 -->
    <div class="section education-section" v-if="resume.education.length">
      <div class="section-title">教育经历</div>
      <div class="section-content">
        <div class="item" v-for="edu in resume.education" :key="edu.id">
          <span>{{ edu.school }} {{ edu.degree ? `(${edu.degree})` : '' }}</span>
          <strong v-if="edu.startDate && edu.endDate">{{ edu.startDate }} 至 {{ edu.endDate }}</strong>
        </div>
      </div>
    </div>

    <div class="section experience-section" v-if="resume.workExperience.length">
      <div class="section-title">工作经历</div>
      <div class="section-content">
        <div class="item" v-for="work in resume.workExperience" :key="work.id">
          <span>{{ work.company }} {{ work.position ? `- ${work.position}` : '' }}</span>
          <span class="date" v-if="work.startDate && work.endDate">({{ work.startDate }} 至 {{ work.endDate }})</span>
          <p v-if="work.description" v-html="marked(work.description)"></p>
        </div>
      </div>
    </div>

    <div class="section skills-section" v-if="resume.skills.length">
      <div class="section-title">技能特长</div>
      <div class="skills-list">
        <p v-for="skill in resume.skills" :key="skill.id" class="skill-item" v-html="marked(skill.skillName)"></p>
      </div>
    </div>

    <div class="section projects-section" v-if="resume.projects.length">
      <div class="section-title">项目经验</div>
      <div class="section-content">
        <div class="item" v-for="project in resume.projects" :key="project.id">
          <div class="project-header">
            <span>{{ project.projectName }}</span>
            <span v-if="project.role" class="role">{{ project.role }}</span>
            <span class="date" v-if="project.startDate && project.endDate">({{ project.startDate }} 至 {{ project.endDate
            }})</span>
          </div>
          <p v-if="project.briefIntroduction" v-html="marked(project.briefIntroduction)"></p>
          <div v-if="project.description" class="project-details" v-html="marked(project.description)"></div>
        </div>
      </div>
    </div>

    <div class="section honors-section" v-if="resume.honors.length">
      <div class="section-title">荣誉奖项</div>
      <div class="section-content">
        <p v-for="honor in resume.honors" :key="honor.id" class="honor-item">
          <span v-html="marked(honor.honorName)"></span>
          <span class="date" v-if="honor.date">{{ honor.date }}</span>
        </p>
      </div>
    </div>

    <div class="section summary-section" v-if="resume.summary">
      <div class="section-title">自我评价</div>
      <p class="summary" v-html="marked(resume.summary)"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '../../store/useResumeStore';
import { computed, watch, onMounted } from 'vue';
import type { ColorShades } from '../../types/color';
import { marked } from 'marked';

// 接受父组件传递的主题色
const props = defineProps<{
  colorShades: ColorShades;
}>();

// 引入store
const resumeStore = useResumeStore();
const resume = computed(() => resumeStore.$state);

// 合并所有样式变量到一个计算属性
const resumeStyle = computed(() => ({
  // 主题色变量
  '--color-lighter': props.colorShades.lighter,
  '--color-light': props.colorShades.light,
  '--color-base': props.colorShades.base,
  '--color-dark': props.colorShades.dark,
  '--color-darker': props.colorShades.darker,
  // 用户设置的间距变量
  '--paragraph-spacing': `${resume.value.resumeSetting.paragraphSpacing}px`,
  '--section-spacing': `${resume.value.resumeSetting.sectionSpacing}px`,
  '--padding-left-right': `${resume.value.resumeSetting.padding_left_right}px`,
  '--padding-top-bottom': `${resume.value.resumeSetting.padding_top_bottom}px`,
}));

// 组件挂载时设置字体大小
onMounted(() => {
  updateFontSize();
});

// 更新字体大小的函数
const updateFontSize = () => {
  document.documentElement.style.fontSize = `${resume.value.resumeSetting.fontSize}px`;
  document.body.style.fontSize = `${resume.value.resumeSetting.fontSize}px`;
};

// 监听字体大小变化
watch(
  () => resume.value.resumeSetting.fontSize,
  () => {
    updateFontSize();
  },
  { immediate: true }
);
</script>

<style scoped>
/* 基础样式设置 */
.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: var(--padding-top-bottom) var(--padding-left-right);
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  font-size: 1rem;
}

/* 移除所有动画效果 */
*,
*::before,
*::after {
  transition: none !important;
  box-sizing: border-box;
}

/* 个人信息样式 */
.personal-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--section-spacing);
  gap: 20px;
}

.personal-details {
  flex: 1;
}

.detail-row {
  margin-bottom: var(--paragraph-spacing);
}

.profile-image img {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  object-fit: cover;
}

/* 章节通用样式 */
.section {
  margin-bottom: var(--section-spacing);
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: var(--paragraph-spacing);
  padding-bottom: 4px;
  border-bottom: 2px solid var(--color-base);
  color: var(--color-base);
}

/* 技能列表样式 */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-item {
  margin: 0;
  padding: 0;
  position: relative;
  margin-right: 12px;
  color: var(--color-base);
}

.skill-item::after {
  content: '•';
  position: absolute;
  right: -10px;
  color: var(--color-light);
}

.skill-item:last-child::after {
  display: none;
}

/* 项目经验样式 */
.project-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: var(--paragraph-spacing);
}

.date {
  color: #666;
}

/* 荣誉奖项样式 */
.honor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: calc(var(--paragraph-spacing) * 0.5) 0;
}

/* 段落样式 */
:deep(p) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: inherit !important;
}

:deep(p + p) {
  margin-top: var(--paragraph-spacing) !important;
}

/* 强调文本样式 */
:deep(strong) {
  color: var(--color-base) !important;
  font-weight: 600;
}

/* 打印样式优化 */
@media print {
  .resume-container {
    margin: 0;
    padding: var(--padding-top-bottom) var(--padding-left-right);
    box-shadow: none;
  }
}
</style>
