<template>
  <div class="resume" :style="resumeStyle">
    <!-- 个人信息 -->
    <section class="personal-section">
      <div class="personal-info">
        <h1 class="name" v-if="resume.personalInfo.name">{{ resume.personalInfo.name }}</h1>
        <div class="info-grid">
          <div class="info-item" v-if="resume.personalInfo.gender">
            <span class="label">性别：</span>{{ resume.personalInfo.gender }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.age">
            <span class="label">年龄：</span>{{ resume.personalInfo.age }}岁
          </div>
          <div class="info-item" v-if="resume.personalInfo.politicalStatus">
            <span class="label">政治面貌：</span>{{ resume.personalInfo.politicalStatus }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.phone">
            <span class="label">电话：</span>{{ resume.personalInfo.phone }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.email">
            <span class="label">邮箱：</span>{{ resume.personalInfo.email }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.university">
            <span class="label">学校：</span>{{ resume.personalInfo.university }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.major">
            <span class="label">专业：</span>{{ resume.personalInfo.major }}
          </div>
          <div class="info-item" v-if="resume.personalInfo.website">
            <span class="label">网站：</span>
            <a :href="resume.personalInfo.website" target="_blank">{{ resume.personalInfo.website }}</a>
          </div>
        </div>
      </div>
      <div class="avatar" v-if="resume.personalInfo.avatar">
        <img :src="resume.personalInfo.avatar" alt="个人照片">
      </div>
    </section>

    <!-- 分割线 -->
    <hr class="section-divider" />

    <!-- 荣誉奖项 -->
    <section class="section" v-if="resume.honors.length">
      <h2 class="section-title">荣誉奖项</h2>
      <ul class="list">
        <li v-for="honor in resume.honors" :key="honor.id" v-html="marked(honor.honorName)"></li>
      </ul>
    </section>

    <!-- 教育经历 -->
    <section class="section" v-if="resume.education.length">
      <h2 class="section-title">教育经历</h2>
      <div class="experience-list">
        <div class="experience-item" v-for="edu in resume.education" :key="edu.id">
          <div class="item-header">
            <h3 class="institution">{{ edu.school }}</h3>
            <span v-if="edu.startDate" class="duration">{{ edu.startDate }} - {{ edu.endDate || '至今' }}</span>
          </div>
          <p class="degree">{{ edu.degree }} - {{ edu.major }}</p>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section class="section" v-if="resume.skills.length">
      <h2 class="section-title">技能特长</h2>
      <ul class="skill-list">
        <li v-for="skill in resume.skills" :key="skill.id">{{ skill.skillName }}</li>
      </ul>
    </section>

    <!-- 工作/实习经历 -->
    <section class="section" v-if="resume.workExperience.length">
      <h2 class="section-title">工作/实习经历</h2>
      <div class="experience-list">
        <div class="experience-item" v-for="work in resume.workExperience" :key="work.id">
          <div class="item-header">
            <p class="company">{{ work.company }}</p>
            <h3 class="position">{{ work.position }}</h3>
            <span v-if="work.startDate" class="duration">{{ work.startDate }} - {{ work.endDate || '至今' }}</span>
          </div>

          <ul class="description-list">
            <li v-for="(desc, index) in work.description.split('\n')" :key="index" v-html="marked(desc)"></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 项目经验 -->
    <section class="section" v-if="resume.projects.length">
      <h2 class="section-title">项目经验</h2>
      <div class="experience-list">
        <div class="experience-item" v-for="project in resume.projects" :key="project.id">
          <div class="item-header">
            <h3 class="project-name">{{ project.projectName }}</h3>
            <p class="role">{{ project.role }}</p>
            <span v-if="project.startDate" class="duration">{{ project.startDate }} - {{ project.endDate || '至今'
              }}</span>
          </div>
          <p class="project-intro" v-html="marked(project.briefIntroduction)"></p>
          <ul class="description-list">
            <li v-for="(desc, index) in project.description.split('\n')" :key="index" v-html="marked(desc)"></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 自我评价 -->
    <section class="section" v-if="resume.summary">
      <h2 class="section-title">自我评价</h2>
      <p class="summary" v-html="marked(resume.summary)"></p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '../../store/useResumeStore';
import { computed, watch, onMounted } from 'vue';
import { marked } from 'marked';

// 引用的store
const resumeStore = useResumeStore();
const resume = computed(() => resumeStore.$state);


// 合并所有样式到一个计算属性
const resumeStyle = computed(() => {
  return {
    '--paragraph-spacing': `${resume.value.resumeSetting.paragraphSpacing}px`,
    '--section-spacing': `${resume.value.resumeSetting.sectionSpacing}px`,
    '--padding-left-right': `${resume.value.resumeSetting.padding_left_right}px`,
    '--padding-top-bottom': `${resume.value.resumeSetting.padding_top_bottom}px`,
    '--themeColor1': resume.value.resumeSetting.themeColor1,
    '--themeColor2': resume.value.resumeSetting.themeColor2
  };
});

// 组件挂载时设置字体大小
onMounted(() => {
  document.documentElement.style.fontSize = `${resume.value.resumeSetting.fontSize}px`;
});

// 监听字体大小变化
watch(
  () => resume.value.resumeSetting.fontSize,
  (newSize) => {
    document.documentElement.style.fontSize = `${newSize}px`;
  }
);
</script>

<style scoped>
.resume {
  background-color: var(--background-color, #fff);
  color: var(--text-color, #333);
  padding: var(--padding-top-bottom, 20px) var(--padding-left-right, 30px);
  font-family: 'Arial', 'Helvetica', sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.personal-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.personal-info {
  flex: 1;
}

.name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--themeColor1);
  margin-bottom: var(--section-spacing);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--paragraph-spacing) 20px;
}

.info-item {
  color: #555;
}

.label {
  font-weight: bold;
  color: var(--themeColor1);
}

.avatar {
  width: 8rem;
  height: 8rem;
  margin-left: 30px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.section-divider {
  border: none;
  border-top: 1px solid var(--themeColor2);
  margin: 6px 0;
}

.section {
  margin-top: var(--section-spacing);
  margin-bottom: var(--section-spacing);
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--themeColor1);
  border-left: 4px solid var(--themeColor1);
  padding-left: 12px;
  margin-bottom: var(--section-spacing);
}

.list,
.skill-list,
.description-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li,
.skill-list li,
.description-list li {
  padding-left: 18px;
  position: relative;
  margin-bottom: var(--paragraph-spacing);
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 18px;
}

.experience-item {
  position: relative;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}

.institution,
.position,
.project-name {
  font-size: 1rem;
}

.duration {
  font-size: 1.1rem;
  color: #999;
}

.degree,
.company,
.role {
  font-size: 1rem;
  margin-bottom: 5px;
  color: var(--themeColor1);
  font-weight: 700;
}

.project-intro {
  margin-bottom: 5px;
}

.summary {
  line-height: 1.6;
  text-align: justify;
}

:deep(p) {
  margin-top: var(--paragraph-spacing) !important;
  margin-bottom: var(--paragraph-spacing) !important;
}

:deep(strong) {
  color: var(--themeColor1) !important;
}

:deep(h3) {
  margin-bottom: 0rem;
}
</style>
