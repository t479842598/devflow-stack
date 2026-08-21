export interface Project {
  id: string
  name: string
  category: string
  scale: string
  status: string
  targetLaunchDate?: string
  startDate?: string
  description?: string
  owner?: string
  externalLinks?: string[]
  isFinalSelection: boolean
  createdAt: string
  updatedAt: string
}

export interface Requirement {
  id: string
  projectId: string
  title: string
  description?: string
  priority: 'P0' | 'P1' | 'P2'
  status: '待排期' | '设计中' | '开发中' | '联调中' | '已完成'
  owner?: string
  dueDate?: string
  parentReqId?: string
  createdAt: string
  updatedAt: string
}

export interface TechOption {
  id: string
  projectId: string
  scenario: string
  frontStack: string
  backStack: string
  scoreEfficiency: number
  scorePerformance: number
  scoreMaintainCost: number
  scoreBackendMatch: number
  weightedScore: number
  advantages?: string
  risks?: string
  isFinal: boolean
  createdAt: string
  updatedAt: string
}

export interface DesignPlan {
  id: string
  projectId: string
  title: string
  stage: string
  startDate?: string
  endDate?: string
  owner?: string
  outputLink?: string
  designPoints?: string
  status: '待排期' | '进行中' | '已完成'
  createdAt: string
  updatedAt: string
}

export interface FrontendResource {
  id: string
  projectId: string
  name: string
  type: 'UI组件库' | '设计规范' | '页面样式' | '图标库' | '主题变量'
  framework: string
  description?: string
  link?: string
  status: '待选用' | '使用中' | '已弃用'
  createdAt: string
  updatedAt: string
}

export interface BackendItem {
  id: string
  projectId: string
  name: string
  itemType: '架构设计' | '接口定义' | '框架配置' | '数据库设计' | '中间件'
  frameworkStack?: string
  description?: string
  status: '草稿' | '评审通过' | '已实现' | '已废弃'
  createdAt: string
  updatedAt: string
}

export interface EnvTask {
  id: string
  projectId: string
  name: string
  scene: '开发环境' | '测试环境' | '预发环境' | '生产环境' | '联调会议' | '代码评审'
  status: '未开始' | '进行中' | '已完成'
  owner?: string
  dueDate?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryItem {
  id: string
  projectId: string
  name: string
  type: '测试用例' | '缺陷跟踪' | '部署发布' | '上线交付' | '运维交接'
  environment: '开发' | '测试' | '预发' | '生产'
  status: '待处理' | '进行中' | '已完成' | '已阻塞'
  owner?: string
  dueDate?: string
  note?: string
  createdAt: string
  updatedAt: string
}

export const FLOW_STAGES = ['立项', '需求梳理', '设计中', '开发中', '联调测试', '已交付'] as const
export const SCENARIOS = ['管理系统', 'Agent开发', '微信小程序', '支付宝小程序', '抖音小程序', 'HBuilderX多平台', 'Vue项目'] as const
export type Scenario = typeof SCENARIOS[number]
