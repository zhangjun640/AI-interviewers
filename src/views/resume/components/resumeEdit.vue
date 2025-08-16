<template>
  <div class="resume-edit">
    <!-- 个人信息编辑组件 -->
    <personalInfo />

    <!-- 教育经历 -->
    <education />

    <!-- 项目经历 -->
    <project />
    <!-- 工作经历 -->
    <workExperience />

    <!-- 专业技能 -->
    <skill />

    <!-- 荣誉奖项 -->
    <honor />

    <!-- 自我评价 -->
    <selfEvaluation />
  </div>
</template>

<script setup lang="ts">
import personalInfo from "./personalInfo.vue";
import education from "./education.vue";
import workExperience from "./workExperience.vue";
import skill from "./skill.vue";
import honor from "./honor.vue";
import selfEvaluation from "./selfEvaluation.vue";
import project from "./project.vue";
</script>

<style scoped>
.resume-edit {
  padding: 12px;
  height: 100vh;
  overflow-y: auto;
  /* 滚动条细 */
  scrollbar-width: thin;
}
</style>
