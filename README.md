# AI-interviewers

##  项目介绍

**AI-interviewers** 是一个开源的简历制作平台，帮助用户轻松创建专业简历，融合 AI 技术，辅助用户润色简历，同时我们通过整合全网的面试而微调的大模型可以帮助大家更好的进行面试模拟！
我们已经将全网最全的[中文面试数据库][https://resume.404.pub/](https://github.com/zhangjun640/Chinese_interview_dataset)开源！
- **技术栈**：Vue 3 + Vite + TypeScript + Ant Design Vue

##  项目预览

编辑简历

![0](https://github.com/zhangjun640/AI-interviewers/blob/main/0.png)

简历市场

![image-20250222224844722](https://img.fish9.cn/blog-img/2023/image-20250222224844722.png)

AI模拟拷打：

![img](https://img.fish9.cn/blog-img/2023/image-20250226124049111.png)

AI润色

![image-20250222224945177](https://img.fish9.cn/blog-img/2023/image-20250222224945177.png)

简历高度自定义配置”

![image-20250310231433143](https://img.fish9.cn/blog-img/2023/image-20250310231433143.png)

## 🚀 快速开始

### 1️⃣ 运行环境要求

- **Node.js**：18+

### 2️⃣ 克隆并安装依赖

```bash
git clone [https://github.com/weidong-repo/AIResume.git](https://github.com/zhangjun640/AI-interviewers)
cd AI-interviewers
npm install
```

### 3️⃣ 运行项目

```bash
npm run dev
```


## 使用 Cloudflare Worker 进行 API 反向代理

本项目可使用 **Cloudflare Worker** 进行反向代理，以解决跨域问题。例如，针对 **阿里云百炼 API**：

1. 将 `workers.js` 上传至 Cloudflare Worker
2. 配置密钥 `API_URL` 指向大模型 API 地址（本项目接口适配 OpenAI 兼容 API，如阿里云、DeepSeek 等）

示例（阿里云 API 地址）：

```bash
https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
```

 兼容 OpenAI API 的大模型均可无缝切换！

**只需更改 `API_URL` 和 API Key，即可快速替换大模型！**

------

## 其它反向代理方式

如果不想使用 Cloudflare Worker，也可以使用其他工具进行反代。**核心要求：只需解决跨域问题，即可流畅调用大模型 API！**

------

##  已完成功能

主要功能：

- ✅ 简历编辑，数据前端持久化
- ✅ 简历导出为 PDF
- ✅ 简历多模板，支持热插拔切换
- ✅ 多套简历模板，支持前端开发者共创
- ✅ 简历撰写的时候，AI可以进行润色
- ✅ AI简历深挖 利用ai 基于单个项目或者经历的长对话对简历进行深度优化
- ✅ AI模拟面试 针对单一项目或者经历对用户进行面试拷打

细节功能：

- ✅ 模板主题色切换
- ✅ 简历高度自定义，如段落间距、区块间距、字体大小、页边距等
- ✅ 网站整体明/暗色切换
- ✅ 右侧实时预览，自动同步用户编辑内容
- ✅ 预览界面可拖动缩放简历
- ✅ 导出 / 导入简历数据
- ✅ 清空数据
- ✅ 预填充示例数据
- ✅ 一键填充虚假数据（快速查看简历效果）
- ✅ 模板市场展示
- ✅ 模板信息展示作者的昵称以及网站
- ✅ 模板信息展示作者的昵称以及网站
- ✅ AI 面试官（大模型读取简历）
- ✅ 可视化简历设计（支持非前端开发者用户拖拽设计简历）
