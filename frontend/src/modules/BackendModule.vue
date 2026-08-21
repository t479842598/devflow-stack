<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const rows = ref<any[]>([])
const form = ref({ name:'', itemType:'架构设计', frameworkStack:'NestJS + Prisma', description:'' })
const pid = computed(()=>app.currentProject?.id)

async function load(){
  if(!pid.value) return
  const r = await api.backends.list({ projectId: pid.value, take:200 })
  rows.value = r.items
}
async function submit(){
  if(!form.value.name) return alert('填名称')
  await api.backends.create({ ...form.value, projectId: pid.value, status:'草稿' })
  form.value = { name:'', itemType:'架构设计', frameworkStack:'NestJS + Prisma', description:'' }
  await load()
}
async function approve(r:any){ await api.backends.update(r.id,{status:'评审通过'}); await load() }
async function remove(r:any){ await api.backends.remove(r.id); await load() }
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">5</span>后端框架</h3>
      <p style="font-size:12px;color:var(--sub);margin-top:4px">架构设计 · 接口定义 · 框架配置 · 数据库设计 · 中间件。</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div><label>名称 *</label><input v-model="form.name" placeholder="如：权限模块设计"/></div>
        <div><label>类型</label><select v-model="form.itemType"><option>架构设计</option><option>接口定义</option><option>框架配置</option><option>数据库设计</option><option>中间件</option></select></div>
        <div><label>框架栈</label><input v-model="form.frameworkStack"/></div>
        <div style="grid-column:1/-1"><label>详细描述</label><textarea v-model="form.description"></textarea></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submit">+ 添加条目</button></div>
      </div>
    </div>
    <div class="card">
      <div v-for="r in rows" :key="r.id" style="border-top:1px solid var(--line);padding:10px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:600;font-size:13px">{{ r.name }}</p>
          <p style="font-size:11px;color:var(--sub)">{{ r.description || '—' }}</p>
        </div>
        <span class="tag t-blue">{{ r.itemType }}</span>
        <span class="tag t-purple">{{ r.frameworkStack || '—' }}</span>
        <span class="tag" :class="r.status==='评审通过'?'t-green':'t-gray'">{{ r.status }}</span>
        <button class="btn-sm btn-green" @click="approve(r)" v-if="r.status==='草稿'">评审通过</button>
        <button class="btn-sm btn-ghost" @click="remove(r)">删</button>
      </div>
      <p v-if="!rows.length" style="text-align:center;color:var(--sub);padding:20px">暂无条目</p>
    </div>
  </div>
</template>
