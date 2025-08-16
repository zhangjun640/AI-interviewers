<template>
  <div class="resume-container" :style="resumeStyle">
    <!-- 左侧边栏 -->
    <aside class="sidebar">
      <div class="profile-section">
        <div class="avatar-wrapper" v-if="resume.personalInfo.avatar">
          <img :src="resume.personalInfo.avatar" alt="头像" class="avatar">
        </div>
        <h1 class="name" v-if="resume.personalInfo.name">{{ resume.personalInfo.name }}</h1>
        <p class="title" v-if="resume.personalInfo.applicationPosition">{{ resume.personalInfo.applicationPosition }}
        </p>
      </div>

      <div class="contact-section" v-if="hasContactInfo">
        <div class="contact-item" v-if="resume.personalInfo.gender">
          <i class="fas fa-user"></i>
          <span>性别：{{ resume.personalInfo.gender }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.age">
          <i class="fas fa-birthday-cake"></i>
          <span>年龄：{{ resume.personalInfo.age }}岁</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.politicalStatus">
          <i class="fas fa-flag"></i>
          <span>政治面貌：{{ resume.personalInfo.politicalStatus }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.phone">
          <i class="fas fa-phone"></i>
          <span>电话：{{ resume.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.email">
          <i class="fas fa-envelope"></i>
          <span>邮箱：{{ resume.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.university">
          <i class="fas fa-university"></i>
          <span>学校：{{ resume.personalInfo.university }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.major">
          <i class="fas fa-graduation-cap"></i>
          <span>专业：{{ resume.personalInfo.major }}</span>
        </div>
        <div class="contact-item" v-if="resume.personalInfo.website">
          <i class="fas fa-globe"></i>
          <span>网站：<a :href="resume.personalInfo.website" target="_blank">{{ resume.personalInfo.website }}</a></span>
        </div>
      </div>

      <div class="side-section" v-if="resume.education.length">
        <h2 class="side-title">教育背景</h2>
        <div class="education-item" v-for="edu in resume.education" :key="edu.id">
          <h3>{{ edu.school }}</h3>
          <p class="edu-major">{{ edu.major }}</p>
          <p class="edu-degree">{{ edu.degree }}</p>
          <p v-if="edu.startDate" class="edu-time">{{ edu.startDate }} - {{ edu.endDate || '至今' }}</p>
        </div>
      </div>

      <div class="side-section" v-if="resume.skills.length">
        <h2 class="side-title">技能特长</h2>
        <div class="skills-wrapper">
          <p class="skill-tag" v-for="skill in resume.skills" :key="skill.id" v-html="marked(skill.skillName)"></p>
        </div>
      </div>
    </aside>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <section class="content-section" v-if="resume.summary">
        <h2 class="section-title">个人简介</h2>
        <p class="summary" v-html="marked(resume.summary)"></p>
      </section>

      <section class="content-section" v-if="resume.workExperience.length">
        <h2 class="section-title">工作经历</h2>
        <div class="experience-item" v-for="work in resume.workExperience" :key="work.id">
          <div class="exp-header">
            <h3>{{ work.company }}</h3>
            <div class="exp-role">{{ work.position }}</div>
            <span v-if="work.startDate" class="exp-date">{{ work.startDate }} - {{ work.endDate || '至今' }}</span>
          </div>

          <div class="exp-desc" v-html="marked(work.description)"></div>
        </div>
      </section>

      <section class="content-section" v-if="resume.projects.length">
        <h2 class="section-title">项目经验</h2>
        <div class="project-item" v-for="project in resume.projects" :key="project.id">
          <div class="proj-header">
            <h3>{{ project.projectName }}</h3>
            <div class="proj-role">{{ project.role }}</div>
            <span v-if="project.startDate" class="proj-date">{{ project.startDate }} - {{ project.endDate || '至今'
              }}</span>
          </div>

          <div class="proj-brief" v-html="marked(project.briefIntroduction)"></div>
          <div class="proj-details" v-html="marked(project.description)"></div>
        </div>
      </section>

      <section class="content-section" v-if="resume.honors.length">
        <h2 class="section-title">荣誉奖项</h2>
        <p v-for="honor in resume.honors" :key="honor.id" class="honor-item">
          <span v-html="marked(honor.honorName)"></span>
          <span class="honor-date" v-if="honor.date">{{ honor.date }}</span>
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '../../store/useResumeStore';
import { computed, watch, onMounted } from 'vue';
import { marked } from 'marked';

// 引用的store
const resumeStore = useResumeStore();
const resume = computed(() => resumeStore.$state);



// 判断是否有联系方式信息
const hasContactInfo = computed(() => {
  const { phone, email, website, gender, age, politicalStatus, university, major } = resume.value.personalInfo;
  return phone || email || website || gender || age || politicalStatus || university || major;
});

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
.resume-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 1122px;
}

/* 侧边栏样式 */
.sidebar {
  background: var(--themeColor1);
  color: white;
  padding: calc(var(--padding-top-bottom) * 0.8) calc(var(--padding-left-right) * 0.8);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}

.profile-section {
  text-align: center;
  margin-bottom: calc(var(--section-spacing) * 0.5);
  padding-bottom: calc(var(--section-spacing) * 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-wrapper {
  width: 90px;
  height: 90px;
  margin: 0 auto calc(var(--paragraph-spacing) * 0.6);
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--themeColor2);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 20px;
  font-weight: 600;
  margin: calc(var(--paragraph-spacing) * 0.6) 0;
  color: white;
}

.title {
  font-size: 14px;
  color: var(--themeColor2);
  margin: 0;
}

.contact-section {
  margin-bottom: calc(var(--section-spacing) * 0.5);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: calc(var(--paragraph-spacing) * 0.6);
  color: white;
  font-size: 12px;
}

.contact-item i {
  width: 14px;
  color: var(--themeColor2);
}

.contact-item a {
  color: var(--themeColor2);
  text-decoration: none;
  word-break: break-all;
}

.side-section {
  margin-bottom: calc(var(--section-spacing) * 0.5);
}

.side-title {
  font-size: 15px;
  color: white;
  margin-bottom: calc(var(--paragraph-spacing) * 0.6);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--themeColor2);
  font-weight: 600;
}

.education-item {
  margin-bottom: calc(var(--section-spacing) * 0.5);
  padding: calc(var(--paragraph-spacing) * 0.5);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.education-item h3 {
  font-size: 13px;
  margin: 0 0 4px;
  color: white;
  font-weight: 600;
}

.edu-major,
.edu-degree,
.edu-time {
  margin: calc(var(--paragraph-spacing) * 0.4) 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.edu-time {
  color: rgba(255, 255, 255, 0.8);
}

.skills-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.skill-tag {
  color: white;
  margin: 0;
  padding: 0;
  position: relative;
  margin-right: 12px;
}

.skill-tag:last-child::after {
  display: none;
}

/* 主要内容区域样式 */
.main-content {
  padding: calc(var(--padding-top-bottom) * 0.8) calc(var(--padding-left-right) * 0.8);
  background: white;
  box-sizing: border-box;
}

.content-section {
  margin-bottom: calc(var(--section-spacing) * 0.8);
}

.section-title {
  font-size: 1.3rem;
  color: var(--themeColor1);
  margin-bottom: var(--section-spacing);
  border-bottom: 2px solid var(--themeColor1);
}

.experience-item,
.project-item {
  margin-bottom: calc(var(--section-spacing) * 0.8);
  padding: calc(var(--section-spacing) * 0.6);
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.exp-header,
.proj-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--paragraph-spacing);
}

.exp-header h3,
.proj-header h3 {
  font-size: 1rem;
  color: var(--themeColor1);
  margin: 0;
  font-weight: 600;
}

.exp-date,
.proj-date {
  font-size: 1.15rem;
  color: #666;
}

.exp-role,
.proj-role {
  color: var(--themeColor1);
  font-size: 1rem;
  margin-bottom: var(--paragraph-spacing);
}

.exp-desc,
.proj-details {
  color: #444;
  line-height: 1.6;
  margin: var(--paragraph-spacing) 0;
}

.proj-brief {
  color: #444;
  line-height: 1.6;
  margin: var(--paragraph-spacing) 0;
  padding: var(--paragraph-spacing);
  background: #f8f8f8;
  border-radius: 4px;
}

.honor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: calc(var(--paragraph-spacing) * 0.5) 0;
  color: var(--themeColor1);
}

.honor-date {
  color: #666;
  margin-left: 1em;
  min-width: 75px;
}

:deep(p) {
  margin: calc(var(--paragraph-spacing) / 2) 0 !important;
  line-height: 1.6;
}

:deep(strong) {
  color: var(--themeColor1) !important;
  font-weight: 600;
}

/* 确保所有元素都使用border-box */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 调整内容区域的边距和间距 */
.content-section {
  margin-bottom: calc(var(--section-spacing) * 0.8);
}

.experience-item,
.project-item {
  margin-bottom: calc(var(--section-spacing) * 0.8);
  padding: calc(var(--section-spacing) * 0.6);
}

/* 调整侧边栏内容的间距 */
.profile-section {
  margin-bottom: calc(var(--section-spacing) * 0.5);
  padding-bottom: calc(var(--section-spacing) * 0.5);
}

.contact-section {
  margin-bottom: calc(var(--section-spacing) * 0.5);
}

.side-section {
  margin-bottom: calc(var(--section-spacing) * 0.5);
}

.education-item {
  margin-bottom: calc(var(--section-spacing) * 0.5);
  padding: calc(var(--paragraph-spacing) * 0.5);
}

/* 打印样式优化 */
@media print {
  .resume-container {
    margin: 0;
    padding: 0;

    box-shadow: none;
    overflow: hidden;
  }

  .sidebar,
  .main-content {
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .resume-container {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>
