<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const rows = ref<any[]>([])
const form = ref({ name:'', type:'UI组件库', framework:'Vue3', description:'', link:'', status:'使用中' })
const pid = computed(()=>app.currentProject?.id)

async function load(){
  if(!pid.value) return
  const r = await api.frontends.list({ projectId: pid.value, take:200 })
  rows.value = r.items
}
async function submit(){
  if(!form.value.name) return alert('填名称')
  await api.frontends.create({ ...form.value, projectId: pid.value })
  form.value = { name:'', type:'UI组件库', framework:'Vue3', description:'', link:'', status:'使用中' }
  await load()
}
async function remove(r:any){ await api.frontends.remove(r.id); await load() }
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">4</span>前端样式</h3>
      <p style="font-size:12px;color:var(--sub);margin-top:4px">管理 UI 组件库 / 设计规范 / 页面样式 / 图标 / 主题变量。</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div><label>名称 *</label><input v-model="form.name"/></div>
        <div><label>类型</label><select v-model="form.type"><option>UI组件库</option><option>设计规范</option><option>页面样式</option><option>图标库</option><option>主题变量</option></select></div>
        <div><label>框架</label><select v-model="form.framework"><option>Vue3</option><option>React</option><option>uni-app</option><option>HBuilderX跨端</option><option>通用-不限框架</option></select></div>
        <div style="grid-column:1/-1"><label>链接</label><input v-model="form.link" placeholder="https://..."/></div>
        <div style="grid-column:1/-1"><label>说明</label><input v-model="form.description"/></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submit">+ 添加</button></div>
      </div>
    </div>
    <div class="card">
      <div v-for="r in rows" :key="r.id" style="border-top:1px solid var(--line);padding:10px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:600;font-size:13px">{{ r.name }}</p>
          <p style="font-size:11px;color:var(--sub)">{{ r.description || '—' }}</p>
        </div>
        <span class="tag t-purple">{{ r.type }}</span>
        <span class="tag t-blue">{{ r.framework }}</span>
        <span class="tag" :class="r.status==='使用中'?'t-green':'t-gray'">{{ r.status }}</span>
        <button class="btn-sm btn-ghost" @click="remove(r)">删</button>
      </div>
      <p v-if="!rows.length" style="text-align:center;color:var(--sub);padding:20px">还没资源</p>
    </div>
  </div>
</template>
