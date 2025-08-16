<template>
  <div class="resume-container" :style="colorShadesStyle">
    <div class="header-decoration"></div>
    <!-- 头部信息区域 -->
    <header class="resume-header">
      <div class="header-content">
        <div class="header-main">
          <h1 class="name">{{ resume.personalInfo.name }}</h1>
          <div class="basic-info">
            <span v-if="resume.personalInfo.gender">{{ resume.personalInfo.gender }}</span>
            <span v-if="resume.personalInfo.age">{{ resume.personalInfo.age }}岁</span>
            <span v-if="resume.personalInfo.university">{{ resume.personalInfo.university }}</span>
            <span v-if="resume.personalInfo.major">{{ resume.personalInfo.major }}</span>
            <span v-if="resume.personalInfo.politicalStatus">{{ resume.personalInfo.politicalStatus }}</span>
          </div>
          <div class="contact-info">
            <a v-if="resume.personalInfo.phone" class="contact-item">
              <i class="fas fa-phone"></i>{{ resume.personalInfo.phone }}
            </a>
            <a v-if="resume.personalInfo.email" class="contact-item">
              <i class="fas fa-envelope"></i>{{ resume.personalInfo.email }}
            </a>
            <a v-if="resume.personalInfo.website" :href="resume.personalInfo.website" target="_blank"
              class="contact-item">
              <i class="fas fa-globe"></i>{{ resume.personalInfo.website }}
            </a>
          </div>
          <div v-if="resume.personalInfo.applicationPosition" class="job-target">
            意向职位: {{ resume.personalInfo.applicationPosition }}
          </div>
        </div>
        <div v-if="resume.personalInfo.avatar" class="avatar">
          <img :src="resume.personalInfo.avatar" alt="头像">
        </div>
      </div>
    </header>

    <!-- 个人总结 -->
    <section v-if="resume.summary" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-user"></i>
      </div>
      <h2 class="section-title">个人总结</h2>
      <div class="section-content summary" v-html="marked(resume.summary)"></div>
    </section>

    <!-- 教育经历 -->
    <section v-if="resume.education.length" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <h2 class="section-title">教育经历</h2>
      <div class="section-content">
        <div v-for="edu in resume.education" :key="edu.id" class="education-item">
          <div class="edu-main">
            <span class="school">{{ edu.school }}</span>
            <span v-if="edu.major" class="major">{{ edu.major }}</span>
            <span v-if="edu.degree" class="degree">{{ edu.degree }}</span>
          </div>
          <div v-if="edu.startDate" class="edu-time">{{ edu.startDate }} ~ {{ edu.endDate || '至今' }}</div>
        </div>
      </div>
    </section>

    <!-- 工作经历 -->
    <section v-if="resume.workExperience.length" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-briefcase"></i>
      </div>
      <h2 class="section-title">工作经历</h2>
      <div class="section-content">
        <div v-for="work in resume.workExperience" :key="work.id" class="work-item">
          <div class="work-header">
            <h3 class="company">{{ work.company }}</h3>
            <div v-if="work.position" class="position">{{ work.position }}</div>
            <span v-if="work.startDate" class="time">{{ work.startDate }} ~ {{ work.endDate || '至今' }}</span>
          </div>

          <div v-if="work.description" class="description" v-html="marked(work.description)"></div>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section v-if="resume.projects.length" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-project-diagram"></i>
      </div>
      <h2 class="section-title">项目经历</h2>
      <div class="section-content">
        <div v-for="project in resume.projects" :key="project.id" class="project-item">
          <div class="project-header">
            <h3 class="project-name">{{ project.projectName }}</h3>
            <div v-if="project.role" class="role">{{ project.role }}</div>
            <span v-if="project.startDate" class="time">{{ project.startDate }} ~ {{ project.endDate || '至今' }}</span>
          </div>

          <div v-if="project.briefIntroduction" class="brief" v-html="marked(project.briefIntroduction)"></div>
          <ul v-if="project.description" class="description-list">
            <li v-for="(desc, index) in String(project.description).split('\n')" :key="index" v-html="marked(desc)">
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section v-if="resume.skills.length" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-tools"></i>
      </div>
      <h2 class="section-title">技能特长</h2>
      <div class="section-content">
        <div class="skills-list">
          <p v-for="skill in resume.skills" :key="skill.id" class="skill-item" v-html="marked(skill.skillName)"></p>
        </div>
      </div>
    </section>

    <!-- 荣誉奖项 -->
    <section v-if="resume.honors.length" class="resume-section">
      <div class="section-icon">
        <i class="fas fa-award"></i>
      </div>
      <h2 class="section-title">荣誉奖项</h2>
      <div class="section-content">
        <div v-for="honor in resume.honors" :key="honor.id" class="honor-item">
          <span class="honor-name" v-html="marked(honor.honorName)"></span>
          <span class="honor-date">{{ honor.date }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '../../store/useResumeStore';
import { computed, watch, onMounted } from 'vue';
import type { ColorShades } from '../../types/color';
import { marked } from 'marked';

// 接受父组件的主题色
const props = defineProps<{
  colorShades: ColorShades;
}>();

// 引入引用的store
const resumeStore = useResumeStore();
const resume = computed(() => resumeStore.$state);

// 动态生成 CSS 变量的样式
const colorShadesStyle = computed(() => ({
  '--color-lighter': props.colorShades.lighter,
  '--color-light': props.colorShades.light,
  '--color-base': props.colorShades.base,
  '--color-dark': props.colorShades.dark,
  '--color-darker': props.colorShades.darker,
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
.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: var(--padding-top-bottom) var(--padding-left-right);
  background: white;
  color: #2c3e50;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.4;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 1rem;
  /* 使用相对单位，基于根元素字体大小 */
}

/* 移除所有动画效果和设置盒模型 */
*,
*::before,
*::after {
  transition: none !important;
  transform: none !important;
  box-sizing: border-box;
}

/* 移除所有默认段落边距并应用用户设置 */
:deep(p) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: inherit !important;
}

/* 调整段落间距 */
:deep(p + p) {
  margin-top: var(--paragraph-spacing) !important;
}

/* 调整章节间距 */
.resume-section {
  margin-bottom: var(--section-spacing);
  position: relative;
  padding-left: 25px;
}

/* 调整内容间距 */
.section-content {
  margin-bottom: var(--paragraph-spacing);
}

/* 调整项目间距 */
.education-item,
.work-item,
.project-item,
.honor-item {
  margin-bottom: var(--paragraph-spacing);
  padding-bottom: var(--paragraph-spacing);
}

/* 调整头部样式 */
.resume-header {
  background: var(--color-base);
  margin: calc(-1 * var(--padding-top-bottom)) calc(-1 * var(--padding-left-right)) var(--section-spacing);
  padding: var(--padding-top-bottom) var(--padding-left-right);
  color: white;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 95%);
  z-index: 1;
}

li {
  list-style-type: none;
}

/* 打印样式优化 */
@media print {

  html,
  body {
    font-size: 1rem !important;
    /* 确保打印时字体大小正确 */
  }

  .resume-container {
    margin: 0;
    padding: var(--padding-top-bottom) var(--padding-left-right);
    box-shadow: none;
    min-height: 297mm;
    font-size: 1rem;
  }
}

/* 头部装饰 */
.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: var(--color-lighter);
  opacity: 0.1;
  border-radius: 0 0 0 100%;
  z-index: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header-main {
  flex: 1;
  min-height: 135px;
}

.name {
  font-size: 1.5em;
  margin: 0 0 6px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.basic-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: inherit;
  opacity: 0.9;
}

.contact-info {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
}

.contact-item {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: inherit;
}

.job-target {
  font-size: inherit;
  opacity: 0.9;
}

/* 章节通用样式优化 */
.section-title {
  font-size: 15px;
  color: var(--color-base);
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-lighter);
  margin-left: 8px;
}

/* 教育经历样式优化 */
.education-item {
  border-bottom: 1px dashed var(--color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.edu-main {
  display: flex;
  gap: 10px;
  align-items: center;
}

.school {
  font-size: 15px;
}

.major,
.degree {
  color: #666;
  font-size: 13px;
}

.edu-time {
  color: #666;
  font-size: 13px;
}

/* 工作经历样式优化 */
.work-item {
  border-bottom: 1px solid var(--color-lighter);
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--paragraph-spacing);
}

.company {
  font-size: inherit;
  font-weight: 500;
}

.position {
  color: var(--color-base);
  margin-bottom: var(--paragraph-spacing);
  font-size: inherit;
}

.description {
  color: #444;
  font-size: inherit;
}

/* 项目经历样式优化 */
.project-item {
  border-radius: 4px;
}



.project-header {
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.project-name {
  font-size: 15px;
}

.role,
.brief,
.description-list {
  font-size: 13px;
}

.role {
  color: var(--color-base);
  margin-bottom: 8px;
}

.brief {
  margin-bottom: 8px;
}

.description-list {
  margin: 6px 0;
  padding-left: 15px;
  list-style-type: circle;
}

.description-list li {
  margin-bottom: 3px;
  position: relative;
}

/* 技能标签样式优化 */
.skills-list {
  display: flex;
  flex-wrap: wrap;
}

.skill-item {
  font-size: inherit;
  color: var(--color-base);
  position: relative;
  margin-right: 12px;
  padding: 0 !important;
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

/* 荣誉奖项样式优化 */
.honor-item {
  border-bottom: 1px dashed var(--color-lighter);
}

.honor-name {
  font-weight: 500;
}

.honor-date {
  color: #666;
}

/* 通用文本样式 */
.time,
.position,
.role,
.brief,
.description {
  font-size: inherit;
  color: #666;
}

.company,
.project-name,
.school {
  font-weight: 500;
  color: var(--color-dark);
  font-size: inherit;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .resume-container {
    padding: 15px;
  }

  .resume-header {
    margin: -15px -15px 20px;
    padding: 20px 15px 25px;
  }

  .header-decoration {
    display: none;
  }

  .header-content {
    flex-direction: column-reverse;
    align-items: center;
    gap: 15px;
  }

  .avatar {
    width: 4rem;
    height: 4rem;
  }

  .header-main {
    text-align: center;
  }

  .basic-info,
  .contact-info {
    justify-content: center;
  }

  .education-item {
    flex-direction: column;
    gap: 5px;
  }

  .work-header {
    flex-direction: column;
    gap: 5px;
  }

  .name {
    font-size: 1.3em;
  }

  .avatar {
    width: 4rem;
    height: 4rem;
  }
}

.avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(strong) {
  color: var(--color-base) !important;
}

:deep(p) {
  margin: 0 !important;
}
</style>
