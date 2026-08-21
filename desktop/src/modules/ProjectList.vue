<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '../store/app'

const emit = defineEmits<{ open:[p:any] }>()
const app = useAppStore()
onMounted(()=>app.fetchProjects())

const statusChip = (s:string)=> s==='已交付'?'t-green':(s==='开发中'||s==='联调测试')?'t-blue':(s==='设计中'||s==='需求梳理')?'t-orange':'t-gray'
</script>

<template>
  <div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <h2 style="font-size:20px">项目总览</h2>
          <p style="font-size:12px;color:var(--sub)">七模块流水线 · 共 {{ app.projects.length }} 个项目</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-ai"><svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 9l-6.1 1.2L12 16l-1.9-5.8L4 9l6.1-1.2L12 2z"/></svg>AI 整体规划</button>
          <button class="btn">+ 新建项目</button>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:8px">
      <div v-for="p in app.projects" :key="p.id"
        class="card" style="cursor:pointer;transition:transform .15s"
        @mouseover="($event.currentTarget as HTMLElement).style.transform='translateY(-2px)'"
        @mouseleave="($event.currentTarget as HTMLElement).style.transform=''"
        @click="emit('open',p)">
        <h3 style="font-size:16px;display:flex;justify-content:space-between;align-items:center;gap:8px">
          {{ p.name }}
          <span class="tag" :class="statusChip(p.status)">{{ p.status }}</span>
        </h3>
        <p style="font-size:12px;color:var(--sub);margin-top:6px">{{ p.description || '暂无描述' }}</p>
        <div style="margin-top:12px;font-size:11px;color:var(--sub);display:flex;gap:8px;flex-wrap:wrap">
          <span class="tag t-purple">{{ p.category }}</span>
          <span class="tag t-orange">{{ p.scale }}</span>
          <span v-if="p.targetLaunchDate" class="tag t-teal">上线 {{ p.targetLaunchDate.slice(0,10) }}</span>
        </div>
      </div>
    </div>
    <div v-if="!app.projects.length && !app.loading" class="card" style="text-align:center;color:var(--sub)">还没有项目，点右上角「+ 新建项目」开始第一个吧</div>
  </div>
</template>
