# AI-interviewers

> 开源简历制作与 AI 模拟面试平台

**AI-interviewers** 是一个基于 Vue 3 + Vite + TypeScript + Ant Design Vue 的开源简历平台。我们帮助用户：

* 快速构建专业简历并导出为 PDF；
* 使用 AI 自动润色与深度挖掘简历内容；
* 利用微调的大模型进行面试模拟；
* 提供可拓展的模板市场与可视化拖拽设计。
* 更详细的使用指导：[用户使用手册](https://github.com/zhangjun640/AI-interviewers/blob/main/User_Manual.pdf)

项目配套的中文面试数据集（已开源）：

* 中文面试数据库：[https://github.com/zhangjun640/Chinese_interview_dataset](https://github.com/zhangjun640/Chinese_interview_dataset)

---

## 目录

1. [项目预览](#项目预览)
2. [技术栈](#技术栈)
3. [功能清单](#功能清单)
4. [快速开始（本地开发）](#快速开始本地开发)
5. [Cloudflare Worker 反向代理（示例）](#cloudflare-worker-反向代理示例)
6. [其它反代方式](#其它反代方式)
7. [部署建议](#部署建议)
8. [模板开发指南](#模板开发指南)
9. [常见问题](#常见问题)
10. [贡献与许可](#贡献与许可)

---

## 项目预览

> 下列图片来自仓库（在 README 显示时可渲染为画廊）。

* 基础页面预览

![基础页面](https://github.com/zhangjun640/AI-interviewers/blob/main/0.png)

* 导入 JSON 简历

![导入 JSON](https://github.com/zhangjun640/AI-interviewers/blob/main/1.png)

* 导出简历数据

![导出数据](https://github.com/zhangjun640/AI-interviewers/blob/main/2.png)

* 模板市场与样式自定义

![模板市场](https://github.com/zhangjun640/AI-interviewers/blob/main/3.png)

* 简历样式自定义面板

![自定义外观](https://github.com/zhangjun640/AI-interviewers/blob/main/4.png)

* 导出 PDF

![导出 PDF](https://github.com/zhangjun640/AI-interviewers/blob/main/5.png)

* AI 助写与模拟面试

![AI 助写](https://github.com/zhangjun640/AI-interviewers/blob/main/6.png)

![AI 模拟面试](https://github.com/zhangjun640/AI-interviewers/blob/main/7.png)

---

## 技术栈

* 框架：Vue 3 + Vite
* 语言：TypeScript
* UI：Ant Design Vue
* 打包/构建：Vite
* AI 接口：兼容 OpenAI Chat Completions API（可替换为阿里云、DeepSeek 等）

---

## 功能清单

**核心功能**

* ✅ 可视化简历编辑（实时预览与缩放）
* ✅ 多套可热插拔模板
* ✅ 导入/导出 JSON 数据
* ✅ 导出 PDF（支持样式配置）
* ✅ AI 助写（摘要、润色、扩展项目经历）
* ✅ AI 模拟面试（基于简历的逐条回合式问答）
* ✅ 模板市场展示与作者信息
* ✅ 漂亮的暗/明模式支持

**细节功能**

* 模板主题色切换、字体与间距配置
* 预填充示例数据 / 一键生成虚假数据查看效果
* 支持右侧同步预览与拖动缩放
* 支持前端持久化（LocalStorage / IndexedDB）

---

## 快速开始（本地开发）

> 要求：Node.js >= 18

### 克隆仓库

```bash
git clone https://github.com/zhangjun640/AI-interviewers.git
cd AI-interviewers
```

### 安装依赖

```bash
npm install
# or
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产包

```bash
npm run build
# 预览构建产物
npm run preview
```

---

## Cloudflare Worker 反向代理（示例）

> 推荐使用 Cloudflare Worker 或任意能解决跨域的反代方案，将后端大模型 API 隐藏在服务端，避免在浏览器暴露 API Key。

### 1）示例 `workers.js`（最小可用）

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
const API_KEY = "替换为你的_API_KEY"

async function handleRequest(req) {
  // 仅允许 POST 转发（可按需增加鉴权）
  if (req.method !== 'POST') return new Response('Only POST', { status: 405 })

  const body = await req.text()

  const upstreamResp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${API_KEY}` // 根据上游 API 要求调整
    },
    body
  })

  const respText = await upstreamResp.text()
  return new Response(respText, {
    status: upstreamResp.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

> 注意：将 `API_KEY` 写在 Worker 的 Secrets（环境变量）中更安全，不要硬编码在源代码里。

### 2）Worker 路由示例

在 Cloudflare 控制台中设置路由，例如：

```
https://api.yourdomain.com/*
```

并将 `API_URL` 指向你的兼容 OpenAI 的模型地址（例如阿里云、DeepSeek 等）。

---

## 其它反向代理方式

如果不想使用 Cloudflare Worker，可选方案：

* Nginx 反向代理（在你的服务器上做 /api 转发并设置 CORS）
* Vercel Serverless / Netlify Functions
* 简单的 Node.js 中转（express / fastify）

### Nginx 简化示例

```nginx
location /api/chat/ {
  proxy_pass https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions;
  proxy_set_header Authorization "ApiKey $API_KEY";
  proxy_set_header Content-Type "application/json";
}
```

---

## 模板开发指南（简要）

1. 在 `src/templates` 下创建新模板文件夹
2. 提供模板元信息 `manifest.json`（名称、作者、缩略图、占位字段）
3. 实现模板渲染组件（Vue）并保证接收统一的简历 JSON 数据结构
4. 在模板市场配置注册你的模板（可通过 PR 提交）

---

## 部署建议

* **静态托管**：Netlify / Vercel / GitHub Pages（若仅前端）
* **带 Server 的部署**：若使用中转 API（反代），可以部署 Worker / Vercel Serverless / 自建 Nginx + Node
* **SSL / HTTPS**：务必为前端和反代域名启用 HTTPS
* **API Key 安全**：不要将私钥写入前端仓库；使用 Server/Worker 的环境变量或 secret 管理。

---

## 常见问题

**Q：API Key 会暴露吗？**
A：如果直接在前端调用第三方模型 API（浏览器端），API Key 会暴露。请使用 Cloudflare Worker、Netlify Functions、Vercel Serverless 等中转服务隐藏 Key。

**Q：如何添加新模板？**
A：按上文“模板开发指南”创建模板并提交 PR。

**Q：AI 功能如何定制？**
A：后端中转处可替换为任意兼容 OpenAI 的 API。同时可以对 prompt 逻辑进行本地化微调，或在后端做更多的安全与计费控制。

---

## 贡献 & 社区

欢迎贡献：功能、模板、修复 bug、优化文档等。

1. Fork 仓库
2. 创建 feature 分支
3. 提交 PR 并在 PR 描述中说明变更

---

## 许可证

本项目采用 MIT 许可证 — 详见仓库中的 `LICENSE` 文件。

---

## 联系方式

如需进一步支持或合作，请在仓库 issue 区提问或联系项目作者。

---

> 祝你招聘顺利，简历敲门砖满载而归 🎯
