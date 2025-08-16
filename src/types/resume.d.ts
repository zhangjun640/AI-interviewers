import type { Template } from "../types/template";
export interface PersonalInfo {
  name: string;
  gender: string;
  phone: string;
  email: string;
  university: string;
  politicalStatus: string;
  website: string;
  avatar: string;
  major: string;
  applicationPosition: string;
  age: string;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
}

export interface Skill {
  id: number;
  skillName: string;
}

export interface Project {
  id: number;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  // 项目简介
  briefIntroduction: string;
  description: string;
}

export interface Honor {
  id: number;
  honorName: string;
  date: string;
  description: string;
}


export interface ResumeSetting {
  themeColor1: string;  // 主题颜色1（深色）
  themeColor2: string;  // 主题颜色2（浅色）
  fontSize: number;     // 字体大小
  sectionSpacing: number;    // 板块之间的间距
  paragraphSpacing: number; // 段落之间的间距
  currentTemplate: String;  // 当前简历模板ID
  padding_left_right: number;  // 左右边距
  padding_top_bottom: number;  // 上下边距
}

export interface ResumeState {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  honors: Honor[];
  summary: string;
  currentId: number;
  isFirstVisit: boolean;
  resumeSetting: ResumeSetting;
}