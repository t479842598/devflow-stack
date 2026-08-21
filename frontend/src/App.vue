<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from './store/app'
import ProjectList from './modules/ProjectList.vue'
import SelectionModule from './modules/SelectionModule.vue'
import RequirementModule from './modules/RequirementModule.vue'
import DesignModule from './modules/DesignModule.vue'
import FrontendModule from './modules/FrontendModule.vue'
import BackendModule from './modules/BackendModule.vue'
import EnvDeliveryModule from './modules/EnvDeliveryModule.vue'

const app = useAppStore()
const step = ref<'home'|'flow'>('home')
const activeTab = ref(0)
const loginForm = ref({ username: '', password: '' })
const loginErr = ref('')

onMounted(async () => {
  if (app.isLoggedIn) {
    try {
      await app.fetchProjects()
    } catch {
      app.logout()
    }
  }
})

const TABS = [
  { key: 0, label: '① 技术选型', comp: SelectionModule },
  { key: 1, label: '② 需求管理', comp: RequirementModule },
  { key: 2, label: '③ 设计计划', comp: DesignModule },
  { key: 3, label: '④ 前端样式', comp: FrontendModule },
  { key: 4, label: '⑤ 后端框架', comp: BackendModule },
  { key: 5, label: '⑥ 环境与联调', comp: EnvDeliveryModule },
  { key: 6, label: '⑦ 交付管理', comp: EnvDeliveryModule },
]

const statusChipClass = (s:string)=>{
  return s==='已交付'?'t-green':(s==='开发中'||s==='联调测试')?'t-blue':(s==='设计中'||s==='需求梳理')?'t-orange':'t-gray'
}

async function doLogin(){
  loginErr.value = ''
  try{
    await app.login(loginForm.value.username, loginForm.value.password)
    await app.fetchProjects()
  }catch(e:any){
    loginErr.value = e?.body?.message || e.message || '登录失败'
  }
}

function openProject(p:any){
  app.currentProject = p
  step.value = 'flow'
  activeTab.value = 0
}

function backHome(){
  app.currentProject = null
  step.value = 'home'
}

const currentComp = computed(() => TABS[activeTab.value].comp)
</script>

<template>
  <div>
    <!-- 未登录 -->
    <div v-if="!app.isLoggedIn" style="max-width:400px;margin:80px auto">
      <div class="card">
        <h2 style="display:flex;align-items:center;gap:8px;font-size:18px">
          <svg style="width:22px;height:22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/><path d="M12 11v9M12 11L4 6.5M12 11l8-4.5"/></svg>
          DevFlow 登录
        </h2>
        <p style="font-size:12px;color:var(--sub);margin-top:6px">使用 NestJS 后端账号登录，支持多设备同步</p>
        <div style="margin-top:16px">
          <label>用户名</label>
          <input v-model="loginForm.username" placeholder="admin" @keyup.enter="doLogin"/>
        </div>
        <div style="margin-top:12px">
          <label>密码</label>
          <input v-model="loginForm.password" type="password" placeholder="••••••" @keyup.enter="doLogin"/>
        </div>
        <p v-if="loginErr" style="color:var(--red);font-size:12px;margin-top:8px">{{ loginErr }}</p>
        <button class="btn" style="width:100%;margin-top:18px;justify-content:center" @click="doLogin">登录</button>
        <p style="font-size:11px;color:var(--sub);margin-top:12px;text-align:center">默认账号 admin / admin123 —— backend/prisma/seed.js 里可改</p>
      </div>
    </div>

    <div v-else style="max-width:1280px;margin:0 auto;padding:18px 16px 60px">
      <!-- 项目列表 -->
      <ProjectList v-if="step==='home'" @open="openProject"/>

      <!-- 项目详情 -->
      <template v-else-if="app.currentProject">
        <div class="card" style="background:linear-gradient(135deg,#233876,#155e97);color:#fff;border:none">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <button class="btn btn-ghost" style="background:rgba(255,255,255,.14);color:#fff" @click="backHome">‹ 返回</button>
              <h2 style="font-size:19px">{{ app.currentProject.name }}</h2>
              <span class="tag" :class="statusChipClass(app.currentProject.status)">{{ app.currentProject.status }}</span>
              <span class="tag t-orange">{{ app.currentProject.scale }}</span>
              <select :value="app.currentProject.status" @change="(e:any)=>app.updateProject(app.currentProject!.id,{status:e.target.value})"
                style="background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:8px;font-size:12px;padding:5px 10px;width:auto">
                <option v-for="s in ['立项','需求梳理','设计中','开发中','联调测试','已交付']" :key="s" :value="s" style="color:#1b2432">{{ s }}</option>
              </select>
            </div>
            <div style="font-size:12px;opacity:.9">
              <span v-if="app.currentProject.owner">👤 {{ app.currentProject.owner }}</span>
              <span v-if="app.currentProject.targetLaunchDate" style="margin-left:12px">🎯 {{ app.currentProject.targetLaunchDate.slice(0,10) }}</span>
            </div>
          </div>
          <p style="margin-top:10px;font-size:12px;opacity:.85">{{ app.currentProject.description || '—' }}</p>
          <p style="margin-top:6px;font-size:11px;opacity:.75">品类：{{ app.currentProject.category }} · ID: {{ app.currentProject.id }}</p>
        </div>

        <!-- 七模块切换 -->
        <div class="card" style="padding:8px;display:flex;gap:4px;overflow-x:auto;flex-wrap:nowrap;position:sticky;top:0;z-index:50;background:#fff">
          <button v-for="t in TABS" :key="t.key"
            class="btn-sm"
            :class="activeTab===t.key ? 'btn' : 'btn-ghost'"
            style="flex:none;white-space:nowrap"
            @click="activeTab=t.key"
          >{{ t.label }}</button>
        </div>

        <component :is="currentComp" />
      </template>
    </div>
  </div>
</template>

<style>
body{background:var(--bg)!important;padding:0!important}
</style>
