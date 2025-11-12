# AI-interviewers

> Open-source Resume Builder & AI Interview Simulation Platform

**AI-interviewers** is an open-source resume creation platform built with Vue 3, Vite, TypeScript, and Ant Design Vue. It helps users:

* Quickly build professional resumes and export them as PDF files;
* Use AI to polish and enhance resume content;
* Simulate interviews using a fine-tuned large language model;
* Access an extensible template marketplace and drag-and-drop visual resume designer.
* For detailed usage instructions, see the [User Manual](https://github.com/zhangjun640/AI-interviewers/blob/main/User_Manual.pdf)

Additionally, we provide an open-source Chinese Interview Dataset:

* Chinese Interview Dataset: [https://github.com/zhangjun640/Chinese_interview_dataset](https://github.com/zhangjun640/Chinese_interview_dataset)

---

## Table of Contents

1. [Project Preview](#project-preview)
2. [Tech Stack](#tech-stack)
3. [Feature Overview](#feature-overview)
4. [Quick Start (Local Development)](#quick-start-local-development)
5. [Cloudflare Worker Reverse Proxy (Example)](#cloudflare-worker-reverse-proxy-example)
6. [Other Reverse Proxy Options](#other-reverse-proxy-options)
7. [Deployment Recommendations](#deployment-recommendations)
8. [Template Development Guide](#template-development-guide)
9. [FAQ](#faq)
10. [Contribution & License](#contribution--license)

---

## Project Preview

> The following screenshots are from the repository (can be displayed as a gallery in README).

* Main Interface

![Main Interface](https://github.com/zhangjun640/AI-interviewers/blob/main/0.png)

* Import JSON Resume

![Import JSON](https://github.com/zhangjun640/AI-interviewers/blob/main/1.png)

* Export Resume Data

![Export Data](https://github.com/zhangjun640/AI-interviewers/blob/main/2.png)

* Template Marketplace & Customization

![Template Marketplace](https://github.com/zhangjun640/AI-interviewers/blob/main/3.png)

* Resume Appearance Customization

![Customization](https://github.com/zhangjun640/AI-interviewers/blob/main/4.png)

* Export PDF

![Export PDF](https://github.com/zhangjun640/AI-interviewers/blob/main/5.png)

* AI Assistance & Interview Simulation

![AI Writing Assistant](https://github.com/zhangjun640/AI-interviewers/blob/main/6.png)

![AI Interview Simulation](https://github.com/zhangjun640/AI-interviewers/blob/main/7.png)

---

## Tech Stack

* Framework: Vue 3 + Vite
* Language: TypeScript
* UI: Ant Design Vue
* Build Tool: Vite
* AI API: Compatible with OpenAI Chat Completions API (supports Aliyun DashScope, DeepSeek, etc.)

---

## Feature Overview

**Core Features**

* ✅ Visual resume editor with real-time preview and scaling
* ✅ Multiple plug-and-play resume templates
* ✅ Import / export JSON data
* ✅ Export PDF with customizable styles
* ✅ AI Writing Assistant for resume polishing and expansion
* ✅ AI Interview Simulation (interactive Q&A based on resume content)
* ✅ Template marketplace with author info display
* ✅ Light/Dark theme support

**Detail Features**

* Customizable theme color, fonts, and spacing
* Pre-filled sample data & fake data generation for demo
* Real-time synchronized preview with drag-to-zoom
* Frontend persistence via LocalStorage / IndexedDB

---

## Quick Start (Local Development)

> Requirements: Node.js >= 18

### Clone the repository

```bash
git clone https://github.com/zhangjun640/AI-interviewers.git
cd AI-interviewers
```

### Install dependencies

```bash
npm install
# or
pnpm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
# Preview build output
npm run preview
```

---

## Cloudflare Worker Reverse Proxy (Example)

> Recommended: use Cloudflare Worker or any reverse proxy to handle CORS and protect your API key from exposure in the browser.

### 1) Minimal `workers.js` Example

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
const API_KEY = "REPLACE_WITH_YOUR_API_KEY"

async function handleRequest(req) {
  if (req.method !== 'POST') return new Response('Only POST', { status: 405 })

  const body = await req.text()

  const upstreamResp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${API_KEY}` // adjust per provider
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

> ⚠️ Always store `API_KEY` in Worker Secrets for security — never hard-code it.

### 2) Worker Routing Example

In Cloudflare dashboard, configure routing such as:

```
https://api.yourdomain.com/*
```

Set `API_URL` to any OpenAI-compatible endpoint (e.g., Aliyun DashScope, DeepSeek, etc.).

---

## Other Reverse Proxy Options

If Cloudflare Worker isn’t used, alternative options include:

* Nginx reverse proxy (handle `/api` forwarding and CORS)
* Vercel Serverless / Netlify Functions
* Simple Node.js middleware (express / fastify)

### Nginx Example

```nginx
location /api/chat/ {
  proxy_pass https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions;
  proxy_set_header Authorization "ApiKey $API_KEY";
  proxy_set_header Content-Type "application/json";
}
```

---

## Template Development Guide (Brief)

1. Create a new folder under `src/templates`
2. Add `manifest.json` (template name, author, preview image, placeholder fields)
3. Implement the Vue render component (must accept standard resume JSON data)
4. Register the template in the marketplace (via PR submission)

---

## Deployment Recommendations

* **Static Hosting**: Netlify / Vercel / GitHub Pages (frontend-only)
* **With API Proxy**: Use Worker / Vercel Serverless / self-hosted Node + Nginx
* **SSL / HTTPS**: Always enable HTTPS for frontend and proxy domains
* **API Key Security**: Store keys in secrets/env variables, never commit them

---

## FAQ

**Q: Will my API key be exposed?**
A: If you call the API directly from the frontend, yes. Use a proxy (Cloudflare Worker, Vercel, Netlify, etc.) to keep it hidden.

**Q: How do I add a new template?**
A: Follow the Template Development Guide above and submit a pull request.

**Q: How can I customize AI features?**
A: Replace the backend proxy with any OpenAI-compatible API. You can also modify prompts or apply fine-tuning on your own server.

---

## Contribution & Community

We welcome contributions — new features, templates, documentation improvements, or bug fixes.

1. Fork the repository
2. Create a feature branch
3. Submit a pull request (describe your changes clearly)

---

## License

This project is licensed under the MIT License — see `LICENSE` for details.

---

## Contact

For issues, suggestions, or collaboration inquiries, please open an issue on GitHub or contact the maintainer.

---

> Wishing you success — may your resume open every door 🚀
