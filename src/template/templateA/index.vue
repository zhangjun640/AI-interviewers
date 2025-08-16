<template>
  <div class="resume-container" :style="resumeStyle">
    <!-- 个人信息 -->
    <section class="personal-info">
      <div class="personal-details">
        <div class="detail-row">
          <div class="detail-item name" v-if="resume.personalInfo.name">
            <span class="value">{{ resume.personalInfo.name }}</span>
          </div>
          <div class="detail-item" v-if="resume.personalInfo.gender">
            <span class="label">性别：</span>
            <span class="value">{{ resume.personalInfo.gender }}</span>
          </div>
          <div class="detail-item" v-if="resume.personalInfo.age">
            <span class="label">年龄：</span>
            <span class="value">{{ resume.personalInfo.age }}</span>
          </div>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.politicalStatus">
          <div class="detail-item">
            <span class="label">政治面貌：</span>
            <span class="value">{{ resume.personalInfo.politicalStatus }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item" v-if="resume.personalInfo.phone">
            <span class="label">电话：</span>
            <span class="value">{{ resume.personalInfo.phone }}</span>
          </div>
          <div class="detail-item" v-if="resume.personalInfo.email">
            <span class="label">邮箱：</span>
            <span class="value">{{ resume.personalInfo.email }}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item" v-if="resume.personalInfo.university">
            <span class="label">学校：</span>
            <span class="value">{{ resume.personalInfo.university }}</span>
          </div>
          <div class="detail-item" v-if="resume.personalInfo.major">
            <span class="label">专业：</span>
            <span class="value">{{ resume.personalInfo.major }}</span>
          </div>
        </div>
        <div class="detail-row" v-if="resume.personalInfo.website">
          <div class="detail-item">
            <span class="label">网站：</span>
            <a :href="resume.personalInfo.website" target="_blank" class="value">{{ resume.personalInfo.website }}</a>
          </div>
        </div>
      </div>
      <div class="profile-image" v-if="resume.personalInfo.avatar">
        <img :src="resume.personalInfo.avatar" alt="个人照片">
      </div>
    </section>

    <!-- 荣誉奖项、复用skills样式 -->
    <section class="section skills-section" v-if="resume.honors.length">
      <div class="section-title">荣誉奖项</div>
      <ul class="skills-list">
        <li v-for="honor in resume.honors" :key="honor.id" v-html="marked(honor.honorName)"></li>
      </ul>
    </section>

    <!-- 在校经历 -->
    <section class="section education-section" v-if="resume.education.length">
      <div class="section-title">教育经历</div>
      <div class="section-content">
        <div class="item" v-for="edu in resume.education" :key="edu.id">
          <p class="school">
            <span>{{ edu.school }}({{ edu.degree }})</span>
            <span>{{ edu.major }}</span>
            <b v-if="edu.startDate">{{ edu.startDate }} 至 {{ edu.endDate || '至今' }}</b>
          </p>
        </div>
      </div>
    </section>

    <!-- 技能特长 -->
    <section class="section skills-section" v-if="resume.skills.length">
      <div class="section-title">技能特长</div>
      <ul class="skills-list">
        <li v-for="skill in resume.skills" :key="skill.id" v-html="marked(skill.skillName)"></li>
      </ul>
    </section>
    <!-- 工作/实习经历 -->
    <section class="section experience-section" v-if="resume.workExperience.length">
      <div class="section-title">工作/实习经历</div>
      <div class="section-content">
        <div class="item" v-for="work in resume.workExperience" :key="work.id">
          <div class="subtitle">
            <div class="work-header">
              <span>{{ work.company }}</span>
              <span>{{ work.position }}</span>
              <span v-if="work.startDate">{{ work.startDate }} 至 {{ work.endDate || '至今' }}</span>
            </div>
          </div>
          <ul>
            <li v-for="(desc, index) in work.description.split('\n')" :key="index" v-html="marked(desc)"></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 项目经验 -->
    <section class="section projects-section" v-if="resume.projects.length">
      <div class="section-title">项目经验</div>
      <div class="section-content">
        <div class="item" v-for="project in resume.projects" :key="project.id">
          <div class="subtitle">
            <div class="project-header">
              <span>{{ project.projectName }}</span>
              <span>{{ project.role }}</span>
              <span v-if="project.startDate">{{ project.startDate }} 至 {{ project.endDate || '至今' }}</span>
            </div>
            <hr>
            <p class="project-introduction" v-html="marked(project.briefIntroduction)"></p>
          </div>
          <ul>
            <li v-for="(desc, index) in project.description.split('\n')" :key="index" v-html="marked(desc)"></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 自我评价 -->
    <section class="section self-evaluation-section" v-if="resume.summary">
      <div class="section-title">自我评价</div>
      <p class="self-evaluation" v-html="marked(resume.summary)"></p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '../../store/useResumeStore';
import { computed, watch, onMounted } from 'vue';
import { marked } from 'marked';

// 引入引用的store
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
<!-- 引入外部css -->
<style scoped>
@font-face {
  font-family: 'zql';
  src: url('./zql.woff2') format('woff2')
}

.resume-container {
  max-width: 960px;
  padding: var(--padding-top-bottom, 20px) var(--padding-left-right, 30px);
  background-color: #ffffff;
  border-radius: 10px;
  box-sizing: border-box;
  font-family: 'zql', sans-serif;
}

:deep(p) {
  margin-top: var(--paragraph-spacing) !important;
  margin-bottom: var(--paragraph-spacing) !important;
}

section {
  margin-top: var(--section-spacing);
  margin-bottom: var(--section-spacing);
}


li {
  list-style: none;
}

.personal-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.personal-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4px 0px;
  flex: 1;
}

.detail-row {
  display: contents;
}

.detail-item {
  display: flex;
  align-items: center;
}

.label {
  min-width: 50px;
  color: #333;
}

.value {
  flex: 1;
  color: #555;
}

.name {
  font-size: 1.3rem;
  font-weight: bold;
}

.profile-image img {
  width: 4rem;
  height: auto;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
}

.section-title {
  width: 100%;
  color: var(--themeColor1);
  background-color: var(--themeColor2);
  font-size: 1.2rem;
  padding: 10px;
  font-weight: bold;
  border-left: 5px solid var(--themeColor1);
  margin-bottom: 10px;
  box-sizing: border-box;
}

/* 内容项目 */
.section-content .item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

}

.subtitle {
  font-weight: bold;
  margin-bottom: 5px;
  word-break: break-all;
}

.project-header,
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-content ul,
.skills-list {
  margin: 0;
  padding-left: 20px;
}

.section-content li,
.skills-list li {
  line-height: 1.5;
  word-break: break-word;
}

.project-introduction {
  font-weight: lighter;
  text-indent: 2em;
}

.self-evaluation {
  word-break: break-word;
  text-indent: 2em;
}

.school {
  display: flex;
  justify-content: space-between;
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}

:deep(strong) {
  color: var(--themeColor1) !important;
}
</style>