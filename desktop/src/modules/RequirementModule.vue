<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const rows = ref<any[]>([])
const form = ref({ title:'', priority:'P1', status:'待排期', owner:'', dueDate:'', description:'' })
const pid = computed(()=>app.currentProject?.id)
const today = new Date().toISOString().slice(0,10)

async function load(){
  if(!pid.value) return
  const r = await api.requirements.list({ projectId: pid.value, take:200 })
  rows.value = r.items
}
async function submit(){
  if(!form.value.title) return alert('填需求标题')
  await api.requirements.create({ ...form.value, projectId: pid.value })
  form.value = { title:'', priority:'P1', status:'待排期', owner:'', dueDate:'', description:'' }
  await load()
}
async function nextStatus(r:any){
  const seq=['待排期','设计中','开发中','联调中','已完成']
  const i = seq.indexOf(r.status)
  if(i<seq.length-1){
    await api.requirements.update(r.id,{status:seq[i+1]}); await load()
  }
}
async function remove(r:any){ await api.requirements.remove(r.id); await load() }
const isOverdue = (r:any)=> r.dueDate && r.dueDate.slice(0,10)<today && r.status!=='已完成'
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">2</span>需求管理</h3>
      <p style="font-size:12px;color:var(--sub);margin-top:4px">录入、拆解、定优先级、跟踪状态。逾期未完成会标红。</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div style="grid-column:1/-1"><label>标题 *</label><input v-model="form.title" placeholder="如：支持批量导入 Excel 订单"/></div>
        <div><label>优先级</label><select v-model="form.priority"><option>P0</option><option>P1</option><option>P2</option></select></div>
        <div><label>状态</label><select v-model="form.status"><option>待排期</option><option>设计中</option><option>开发中</option><option>联调中</option><option>已完成</option></select></div>
        <div><label>负责人</label><input v-model="form.owner"/></div>
        <div><label>截止</label><input type="date" v-model="form.dueDate"/></div>
        <div style="grid-column:1/-1"><label>描述</label><textarea v-model="form.description"></textarea></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submit">+ 录入需求</button></div>
      </div>
    </div>
    <div class="card">
      <h3 style="font-size:14px;margin-bottom:8px">需求列表（{{ rows.length }}）</h3>
      <div v-for="r in rows" :key="r.id" style="border-top:1px solid var(--line);padding:10px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:600;font-size:13px">{{ r.title }}</p>
          <p style="font-size:11px;color:var(--sub);margin-top:2px">{{ r.description || '—' }}</p>
        </div>
        <span class="tag" :class="r.priority==='P0'?'t-red':r.priority==='P1'?'t-orange':'t-gray'">{{ r.priority }}</span>
        <span class="tag t-blue">{{ r.status }}</span>
        <span v-if="isOverdue(r)" class="tag t-red">已逾期</span>
        <span v-else-if="r.dueDate" class="tag t-gray">{{ r.dueDate.slice(0,10) }}</span>
        <button class="btn-sm btn" @click="nextStatus(r)" v-if="r.status!=='已完成'">下一状态</button>
        <button class="btn-sm btn-ghost" @click="remove(r)">删</button>
      </div>
      <p v-if="!rows.length" style="text-align:center;color:var(--sub);padding:20px 10px">还没需求，从上方录入第一条</p>
    </div>
  </div>
</template>
