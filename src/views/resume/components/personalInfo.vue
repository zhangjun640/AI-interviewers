<template>
  <a-collapse v-model:activeKey="activeKey" class="personal-info-collapse">
    <a-collapse-panel key="1" header="个人信息" class="personal-info-panel">
      <a-space direction="vertical" style="width: 100%" class="personal-info-space ">
        <!-- 姓名、联系电话-->
        <a-row gutter="24">
          <a-col :span="12">
            <a-input v-model:value="personalInfo.name" placeholder="请输入姓名" addonBefore="姓名" />
          </a-col>
          <a-col :span="12">
            <a-input v-model:value="personalInfo.phone" placeholder="请输入联系电话" addonBefore="联系电话" />
          </a-col>
        </a-row>

        <!-- 电子邮箱、所在大学-->
        <a-row gutter="24">
          <a-col :span="12">
            <a-input v-model:value="personalInfo.email" placeholder="请输入电子邮箱" addonBefore="电子邮箱" />
          </a-col>
          <a-col :span="12">
            <a-input v-model:value="personalInfo.university" placeholder="请输入所在大学" addonBefore="所在大学" />
          </a-col>
        </a-row>

        <!-- 政治面貌、性别 -->
        <a-row gutter="24">
          <a-col :span="12">
            <a-select v-model:value="personalInfo.politicalStatus" placeholder="请选择政治面貌" :options="politicalOptions"
              allowClear style="width: 100%;" />
          </a-col>
          <a-col :span="12">
            <a-select v-model:value="personalInfo.gender" placeholder="请选择性别" :options="genderOptions" allowClear
              style="width: 100%;" />
          </a-col>
        </a-row>
        <!-- 专业、年龄 -->
        <a-row gutter="24">
          <a-col :span="12">
            <a-input v-model:value="personalInfo.major" placeholder="请输入专业" addonBefore="专业" />
          </a-col>
          <a-col :span="12">
            <a-input v-model:value="personalInfo.age" placeholder="请输入年龄" addonBefore="年龄" />
          </a-col>
        </a-row>



        <a-row gutter="24">
          <a-col :span="12">
            <!-- 个人网站 -->
            <a-input v-model:value="personalInfo.website" placeholder="请输入个人网站" addonBefore="个人网站" />
          </a-col>
          <a-col :span="12">
            <!-- 应聘岗位 -->
            <a-input v-model:value="personalInfo.applicationPosition" placeholder="应聘岗位" addonBefore="岗位" />
          </a-col>
        </a-row>
        <!-- 头像上传 (base64) -->
        <div class="avatar-wrapper">
          <!-- 头像展示 -->
          <img v-show="personalInfo.avatar" :src="personalInfo.avatar" alt="avatar" class="avatar" />

          <!-- 上传按钮始终存在，但根据头像情况切换显示 -->
          <a-upload listType="picture-card" :show-upload-list="false" :before-upload="beforeUpload"
            @change="handleAvatarChange">
            <template #default>
              <div class="upload-area">
                <PlusOutlined />
                <div style="margin-top: 8px">{{ personalInfo.avatar ? '更换头像' : '上传头像' }}</div>
              </div>
            </template>
          </a-upload>
        </div>

      </a-space>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useResumeStore } from '../../../store';
import { PlusOutlined } from '@ant-design/icons-vue';

// 默认展开
const activeKey = ref(['1']);

// 获取 store 实例
const resumeStore = useResumeStore();
const personalInfo = computed(() => resumeStore.personalInfo);

// 政治面貌和性别选项
const politicalOptions = [
  { label: '中共党员', value: '中共党员' },
  { label: '中共预备党员', value: '中共预备党员' },
  { label: '共青团员', value: '共青团员' },
  { label: '群众', value: '群众' },
  { label: '其他', value: '其他' }
];
const genderOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
  { label: '其他', value: '其他' }
];

// 上传头像前的验证
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  return isJpgOrPng && isLt2M;
};

// 处理头像上传 (base64)
const handleAvatarChange = (info: any) => {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    personalInfo.value.avatar = e.target?.result as string;
  };
  reader.readAsDataURL(info.file.originFileObj);
};

// 监听 store 的变化，保存到 localStorage
watch(
  () => resumeStore.$state,
  () => {
    resumeStore.saveToLocalStorage();
  },
  { deep: true }
);
</script>

<style scoped>
.personal-info-collapse {
  margin: 0 auto;
  max-width: 800px;
  font-family: 'zql';
  background-color: var(--color-7);
}


.personal-info-space {
  font-family: 'zql';
}



.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
}

.upload-area {
  text-align: center;
  color: #999;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
}

.ant-upload {
  margin-bottom: 0px !important;
}
</style>
