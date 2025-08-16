import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const isDark = ref<boolean>(localStorage.getItem("theme") === "dark");
    const theme = ref<string>(isDark.value ? "#9c87fe" : "#7A1B19");
    const aliApiKey = ref<string>("");
    const aliApiUrl = import.meta.env.VITE_API_URL; //这里用默认的
    const modelName = ref<string>("qwen-turbo");
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      theme.value = isDark.value ? "#9c87fe" : "#7A1B19";
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark.value);
    };

    // 初始化主题
    const initTheme = () => {
      isDark.value = localStorage.getItem("theme") === "dark";
      theme.value = isDark.value ? "#9c87fe" : "#7A1B19";
      document.documentElement.classList.toggle("dark", isDark.value);
    };

    // 监听 isDark 变化，自动更新主题颜色和 class
    watch(isDark, (value) => {
      theme.value = value ? "#9c87fe" : "#7A1B19";
      document.documentElement.classList.toggle("dark", value);
    });

    return {
      isDark,
      theme,
      toggleTheme,
      initTheme,
      aliApiKey,
      aliApiUrl,
      modelName,
    };
  },
  {
    persist: true, // 开启持久化存储
  }
);
