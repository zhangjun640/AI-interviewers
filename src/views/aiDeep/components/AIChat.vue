<script setup lang="ts">
import { ref, nextTick, reactive } from "vue";
import { sendLLMRequest } from "../../../api/LLMAPI";
import type { DialogueHistory, AIDialogue } from "../../../types/aiDialogue";
import { marked } from "marked";
import { inject, type Ref } from "vue";

const jd = inject<Ref<string>>("jd", ref(""));
const resumeProject = inject<Ref<string>>("resumeProject", ref(""));
const beginTour = inject<() => void>("beginTour");

const chatHistoryRef = ref<HTMLElement>();
const isLoading = ref(false);
// 用户选择是经历扩展还是模拟面试 true 为经历扩展，false 为模拟面试
const userChoose = ref<boolean>();
// 输入框中的信息
const message = ref<AIDialogue>({
  role: "user",
  content: "",
});
// 多轮聊天记录
const messages = ref<DialogueHistory>([]);

//用户选择扩展还是模拟面试
const choose = (isExtend: boolean) => {
  userChoose.value = isExtend;
  if (userChoose.value) {
    // 经历扩展
    messages.value.push({
      role: "system",
      content:
        "你是一个AI助手，请根据用户输入的岗位jd以及工作/项目经历进行深度优化，你的身份是一个简历优化师，你可以通过查看我的岗位jd和我的经历不断询问我问题，你是主导者，要主导本次对话，每轮对话都要根据我的简历主动提出问题等我回复你，然后你不断修改简历，然后帮我优化我的简历，如果简历有优化，请使用```resume   ```进行包裹！一行为一条内容",
    });
    message.value.role = "user";
    message.value.content = `您好，请读取我的这段项目/工作经历以及岗位jd！${
      "```resume" + resumeProject.value + " ```"
    }  ${"```岗位jd" + jd.value + " ```"} `;
    sendMessage();
  } else {
    // 模拟面试
    messages.value.push({
      role: "system",
      content:
        "你是一个AI面试官，请根据用户输入的岗位jd以及工作/项目经历进行深度的项目拷打，你可以通过查看我的岗位jd和我的经历不断询问我问题，可以适当沿着项目延申询问或者深挖项目，可以追问我。你是主导者，要主导本次对话，不断向我进行面试提问，尽量一次只提问一个问题，然后用户回复后可以接着追问或者另外从另一个方面进行提问。",
    });
    message.value.role = "user";
    message.value.content = `面试官，您好，请读取我的这段项目/工作经历以及岗位jd！${
      "```resume" + resumeProject.value + " ```"
    }  ${"```岗位jd" + jd.value + " ```"} `;
    sendMessage();
  }
};

const formatMessage = (content: string) => {
  // 过滤掉```resume  ```中的内容
  content = content.replace(/```resume[\s\S]*?```/g, "");
  content = content.replace(/```岗位jd[\s\S]*?```/g, "");
  return marked(content);
};
// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
};
// 是否结束面试
const end = ref(false);
// 发送信息给AI
const sendMessage = async () => {
  if (
    !message.value.content.trim() ||
    isLoading.value ||
    userChoose.value === undefined ||
    userChoose.value === null
  )
    return;

  message.value.content = message.value.content.trim();
  // 深拷贝
  let newMessage = JSON.parse(JSON.stringify(message.value));
  messages.value.push(newMessage);
  message.value.content = "";
  await scrollToBottom();
  isLoading.value = true;
  try {
    await sendLLMRequest(messages.value, (responseText, isComplete) => {
      if (messages.value[messages.value.length - 1].role === "user") {
        messages.value.push({ role: "assistant", content: responseText });
      } else {
        messages.value[messages.value.length - 1].content = responseText;
      }
      // 如果是结尾，就输出```resume ```中ai优化后的内容到左侧输入框中
      if (isComplete) {
        let aiEnhanceText = messages.value[messages.value.length - 1].content;
        // 提取AI生成的 ```resume ... ``` 内的内容，填入用户右侧输入框中
        const match =
          aiEnhanceText.match(/```resume\s*([\s\S]*?)```/) ||
          aiEnhanceText.match(/```([\s\S]*?)```/);
        if (match) {
          aiEnhanceText = match[1].trim();
          resumeProject.value = aiEnhanceText;
          // 替换掉ai回复中的```resumt  ```信息
          messages.value[messages.value.length - 1].content = messages.value[
            messages.value.length - 1
          ].content.replace(
            /```resume[\s\S]*?```/g,
            "`已自动填充进右侧输入框`"
          );
        }
      }
      scrollToBottom();
    });
  } catch (error) {
    console.error("AI 处理失败:", error);
    messages.value.push({
      role: "assistant",
      content: "AI 处理失败，请稍后再试。",
    });
  } finally {
    isLoading.value = false;
  }
};
const interviewResult = ref("");
const interviewResultScore = ref(0);
// 结束面试，获取面试结果
const endInterview = async () => {
  end.value = true;
  // 拷贝数组
  let newMessages = reactive(
    messages.value.map((item) => ({
      ...item, // 浅拷贝对象
    }))
  );
  newMessages.push({
    role: "user",
    content:
      "好的，结束面试了，满分100分的话给我一个客观的分数用```分数```包裹，例如```40```，另外你帮我总结一下我的面试情况，告诉我将来哪些地方可以加强，以及我在面试中的优点和不足的地方。你返回的内容不要出现markdown语法，直接换行序号分点就行。",
  });
  isLoading.value = true;
  try {
    await sendLLMRequest(newMessages, (responseText) => {
      //提取并且过滤掉```分数 ```包裹的内容，为分数
      const match = responseText.match(/```\s*([\s\S]*?)```/);
      if (match) {
        interviewResultScore.value = parseInt(match[1].trim());
        responseText = responseText.replace(/```[\s\S]*?```/g, "");
      }
      interviewResult.value = responseText;
      scrollToBottom();
    });
  } catch (error) {
    console.error("AI 处理失败:", error);
    messages.value.push({
      role: "assistant",
      content: "AI 处理失败，请稍后再试。",
    });
  } finally {
    isLoading.value = false;
  }
};

//重新开始面试
const restart = () => {
  messages.value = [];
  end.value = false;
  interviewResult.value = "";
  interviewResultScore.value = 0;
  userChoose.value = undefined;
  message.value.content = "";
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-history" ref="chatHistoryRef">
      <a-alert
        show-icon
        message="AI深度交流-根据您所填的项目、工作等通过问答方式对您的经历进行扩展优化或者模拟面试问答！"
        type="info"
      />
      <a-alert
        show-icon
        message="tips：使用前请优先填写右侧的岗位jd以及工作/项目经历！"
        type="warning "
        closable
      />
      <!-- 让用户选择是经历扩展还是模拟面试 -->
      <a-space
        wrap
        class="button-group"
        v-if="userChoose === undefined || userChoose === null"
        id="ai-choose-content"
      >
        <a-button type="primary" @click="choose(true)">经历深挖</a-button>
        <a-button type="primary" @click="choose(false)"> 模拟面试</a-button>
      </a-space>
      <div v-else style="text-align: center">
        <a-tag color="green">{{ userChoose ? "经历深挖" : "模拟面试" }}</a-tag>
      </div>
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item"
        :class="msg.role"
      >
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(msg.content)"></div>
        </div>
      </div>
      <!-- 如果用户选择了模拟面试，则显示结束面试，然后获取面试结果 -->
      <div
        v-show="!userChoose && messages.length > 5 && !end"
        style="text-align: center"
      >
        <a-button type="primary" @click="endInterview()" :disabled="isLoading"
          >结束面试</a-button
        >
      </div>

      <div v-if="end" class="interview-result">
        <a-badge-ribbon
          :text="'AI评分：' + interviewResultScore + '分'"
          :color="interviewResultScore >= 60 ? 'green' : 'red'"
        >
          <a-card title="AI评估面试结果" size="small" class="result-card">
            <div
              class="message-text result-content"
              v-html="marked(interviewResult)"
            ></div>
          </a-card>
        </a-badge-ribbon>
      </div>

      <div v-if="end" style="text-align: center">
        <a-button type="primary" @click="restart()" :disabled="isLoading"
          >重新开始</a-button
        >
      </div>
    </div>

    <!-- 输入区域 -->
    <div
      v-if="userChoose === undefined || userChoose === null"
      style="text-align: center"
    >
      <p style="color: red">
        请先在上方按钮中选择"经历深挖"或者"模拟面试"！<span
          @click="beginTour"
          style="
            border-radius: 5px;
            background-color: #1677ff;
            font-size: 12px;
            color: white;
            padding: 3px;
            cursor: pointer;
          "
          >使用说明</span
        >
      </p>
    </div>
    <div class="chat-input" id="ai-chat-content">
      <a-textarea
        v-model:value="message.content"
        :rows="3"
        placeholder="输入消息，Enter 发送..."
        :disabled="isLoading || end"
        @keydown.enter.prevent="sendMessage"
      />
      <div class="send-button">
        <a-button
          type="primary"
          :loading="isLoading"
          @click="sendMessage"
          :disabled="
            !message.content.trim() ||
            userChoose === undefined ||
            userChoose === null ||
            end
          "
        >
          发 送
        </a-button>
        <!-- TODO -->
        <!-- <a-button type="primary" :loading="isLoading" :disabled="(messages.length < 3)">
          AI帮答
        </a-button> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 8px;
  display: flex;
  justify-content: center;
}

.message-item {
  display: flex;
  gap: 12px;
  max-width: 85%;
  margin: 8px 0;
}

.message-item.assistant {
  align-self: flex-start;
}

.message-item.user {
  align-self: flex-end;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  min-width: 60px;
  max-width: 100%;
  overflow-wrap: break-word;
}

.assistant .message-content {
  background: var(--chat-ai-bubble);
  border-bottom-left-radius: 4px;
  color: var(--text-color);
  border: 1px solid var(--chat-border);
}

.system {
  display: none;
}

.user .message-content {
  background: var(--color-4);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-text {
  word-break: break-word;
  max-width: 100%;
}

.message-text :deep(p) {
  margin: 0 !important;
  margin-block-end: 0 !important;
}

.message-text :deep(pre) {
  background: var(--bg-color);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
  border: 1px solid var(--chat-border);
  max-width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}

.message-text :deep(code) {
  background: var(--bg-color);
  padding: 2px 4px;
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
}

.chat-input {
  padding: 12px 10px 12px 0px;
  background: var(--chat-input-bg);
  border-top: 1px solid var(--chat-border);
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px;
  align-items: center;
  min-width: 40px;
}

.typing-indicator span {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--color-4);
  opacity: 0.8;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.4s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

/* 自定义滚动条样式 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: transparent;
}

.chat-history::-webkit-scrollbar-thumb {
  background: var(--chat-border);
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: var(--color-6);
}

/* 输入框样式优化 */
:deep(.ant-input) {
  background: var(--chat-input-bg);
  border-color: var(--chat-border);
  color: var(--chat-input-text);
  min-height: 24px !important;
  max-height: 120px !important;
  height: auto !important;
  resize: none;
  border-radius: 8px;
  line-height: 1.5;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

:deep(.ant-input:hover:not(:disabled)) {
  border-color: var(--color-4);
}

:deep(.ant-input:focus) {
  border-color: var(--color-4);
  box-shadow: 0 0 0 2px rgba(94, 33, 224, 0.1);
}

:deep(.ant-input:disabled) {
  background: var(--chat-input-bg);
  opacity: 0.7;
  color: var(--color-6);
  cursor: not-allowed;
}

:deep(.ant-input::placeholder) {
  color: var(--chat-placeholder);
}

/* 按钮禁用状态优化 */
:deep(.ant-btn:disabled) {
  background-color: var(--color-6) !important;
  border-color: var(--color-6) !important;
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.ant-btn) {
  height: 38px;
  padding: 0 16px;
  margin-top: 1px;
  background-color: var(--color-4) !important;
  border-color: var(--color-4) !important;
}

:deep(.ant-btn:hover) {
  background-color: var(--color-5) !important;
  border-color: var(--color-5) !important;
}

:deep(.ant-btn:active) {
  background-color: var(--color-3) !important;
  border-color: var(--color-3) !important;
}

.send-button {
  display: flex;
  flex-direction: column;
}

.interview-result {
  text-align: center;
  width: 100%;
  padding: 20px 0;
}

.result-card {
  background: var(--chat-ai-bubble);
  border: 1px solid var(--chat-border);
  border-radius: 12px;
}

.result-content {
  text-align: left;
  padding: 10px;
  color: var(--text-color);
}

.result-content :deep(p) {
  margin: 8px 0 !important;
  line-height: 1.6;
}

.result-content :deep(ol),
.result-content :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.result-content :deep(li) {
  margin: 4px 0;
  line-height: 1.6;
}

:deep(.ant-card-head) {
  border-bottom-color: var(--chat-border);
  min-height: 40px;
}

:deep(.ant-card-head-title) {
  padding: 8px 0;
  color: var(--text-color);
}

:deep(.ant-ribbon-text) {
  padding: 4px 8px;
  font-size: 14px;
}
</style>
