<template>
  <div class="narrow-screen">
    <div class="content">
      <a-result status="warning" title="暂不支持移动端访问" sub-title="抱歉，暂不支持移动端访问，请使用电脑访问以获得最佳体验">
        <template #icon>
          <laptop-outlined class="custom-icon" />
        </template>
        <template #extra>
          <div class="github-section">
            <p class="preview-text">您可以在 GitHub 查看项目预览截图：</p>
            <a href="https://github.com/weidong-repo/AIResume" target="_blank" class="github-link">
              <github-outlined />
              <span>AIResume</span>
            </a>
          </div>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LaptopOutlined, GithubOutlined } from '@ant-design/icons-vue';
</script>

<style scoped>
.narrow-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-color);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content {
  width: 100%;
  max-width: 500px;
}

.custom-icon {
  font-size: 48px;
  color: var(--color-base);
}

.github-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-text {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-base);
  border-radius: 20px;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s ease;
}

.github-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>