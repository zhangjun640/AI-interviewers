import { computed } from "vue";
import { useSettingsStore } from "../store/useSettingsStore";
import type { DialogueHistory } from "../types/aiDialogue";
import { WorkerPool } from "../worker/workerPool";

//读取用户设置的API地址和API Key
const settingsStore = useSettingsStore();
const API_URL = "37.tcp.cpolar.top:10677/api/chat";
const model = computed(() => settingsStore.modelName);
// 创建线程池，最多 4 个工作线程
const workerPool = new WorkerPool(4);
export async function sendLLMRequest(
  messages: DialogueHistory,
  onResponse: (responseText: string, isComplete: boolean) => void
): Promise<void> {
  workerPool.execute(messages, model.value, API_URL, onResponse);
}
