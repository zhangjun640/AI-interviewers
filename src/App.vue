<script setup lang="ts">
import Header from "./components/Header/index.vue";
import ThemeSwitcher from './components/ThemeSwitcher/index.vue';
import NarrowScreen from './components/narrow/index.vue';
import { useResumeStore } from './store/useResumeStore';
import { useSettingsStore } from './store/useSettingsStore';
import { onMounted, ref, onBeforeMount } from 'vue';
const settingsStore = useSettingsStore();
const showNarrowScreen = ref(false);


// 检查屏幕宽度
const checkScreenWidth = () => {
  showNarrowScreen.value = window.innerWidth < 768;
};

onBeforeMount(() => {
  checkScreenWidth();
  window.addEventListener('resize', checkScreenWidth);
});

// 页面加载时初始化
onMounted(async () => {
  const resumeStore = useResumeStore();
  await resumeStore.initCheck();
  settingsStore.initTheme();
});
</script>

<template>
  <narrow-screen v-if="showNarrowScreen" />
  <template v-else>
    <Header />
    <a-config-provider :theme="{
      token: {
        colorPrimary: settingsStore.theme,
      },
    }">
      <router-view v-slot="{ Component }">
        <keep-alive include="aiDeep">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </a-config-provider>
    <ThemeSwitcher />
  </template>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
