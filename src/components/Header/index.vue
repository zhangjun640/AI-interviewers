<template>
  <header class="navbar">
    <img
      src="https://www.sdu.edu.cn/images/logo.png"
      alt=""
      style="height: 45px; margin-right: 30px"
    />
    <nav>
      <ul style="position: relative">
        <li>
          <router-link to="/">
            <SvgIcon iconName="resume" />
            简历制作
          </router-link>
        </li>
        <li ref="templateStore">
          <router-link to="/template">
            <SvgIcon iconName="templateStore" />
            模板市场
          </router-link>
        </li>
        <li ref="setting">
          <router-link to="/aiDeep">
            <SvgIcon iconName="ai" />
            AI深度交流
          </router-link>
        </li>
        <!-- <li ref="setting"><router-link to="/setting">
            <SvgIcon iconName="setting" />
            网站配置
          </router-link></li> -->

        <!-- <li><router-link to="/resumeDesign">简历模板设计</router-link></li> -->
      </ul>
    </nav>
  </header>

  <!-- 漫游式引导 -->
  <a-tour
    v-model:open="tourOpen"
    :steps="tourSteps"
    :mask="true"
    :next-button-props="{ children: '下一步' }"
    :prev-button-props="{ children: '上一步' }"
    :finish-button-props="{ children: '完成' }"
    @finish="handleFinish"
    @close="handleFinish"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SvgIcon from "../SvgIcon.vue";
import { useResumeStore } from "../../store/useResumeStore";
import type { TourProps } from "ant-design-vue";

const store = useResumeStore();
const setting = ref(null);
const templateStore = ref(null);
const tourOpen = ref(false); // 控制引导是否打开

const tourSteps: TourProps["steps"] = [
  {
    title: "网站配置",
    description: "请先进入网站配置，完善基本信息（否则无法使用大模型润色！）",
    target: () => setting.value,
  },
  {
    title: "选择模板",
    description: "然后进入模板市场，挑选适合你的简历模板。",
    target: () => templateStore.value,
  },
];

// 引导完成时的回调
const handleFinish = () => {
  tourOpen.value = false;
};

onMounted(() => {
  if (store.isFirstVisit) {
    tourOpen.value = true; // 开始引导
  }
});
</script>

<style scoped>
.navbar {
  background: linear-gradient(
    to right,
    var(--color-5),
    var(--color-6),
    var(--color-5)
  );
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navbar nav ul li {
  float: left;
}

.navbar nav ul li a {
  display: block;
  color: white;
  text-align: center;
  font-size: 17px;
  padding: 17px 16px;
  text-decoration: none;
  transition: all 0.22s;
}

.navbar nav ul li a:hover {
  background-color: #ffffff;
  color: black;
}
</style>
