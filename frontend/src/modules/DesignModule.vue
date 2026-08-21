<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const rows = ref<any[]>([])
const form = ref({ title:'', stage:'需求分析', startDate:'', endDate:'', owner:'', outputLink:'', designPoints:'' })
const pid = computed(()=>app.currentProject?.id)

async function load(){
  if(!pid.value) return
  const r = await api.designs.list({ projectId: pid.value, take:200 })
  rows.value = r.items
}
async function submit(){
  if(!form.value.title) return alert('填标题')
  await api.designs.create({ ...form.value, projectId: pid.value })
  form.value = { title:'', stage:'需求分析', startDate:'', endDate:'', owner:'', outputLink:'', designPoints:'' }
  await load()
}
async function remove(r:any){ await api.designs.remove(r.id); await load() }
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">3</span>设计计划</h3>
      <p style="font-size:12px;color:var(--sub);margin-top:4px">关联需求，按阶段（需求分析/原型/UI/开发/联调/上线）排期。</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div><label>阶段</label><select v-model="form.stage"><option>需求分析</option><option>原型设计</option><option>UI定稿</option><option>开发实现</option><option>联调测试</option><option>交付上线</option></select></div>
        <div style="grid-column:span 2"><label>标题 *</label><input v-model="form.title"/></div>
        <div><label>开始</label><input type="date" v-model="form.startDate"/></div>
        <div><label>结束</label><input type="date" v-model="form.endDate"/></div>
        <div><label>负责人</label><input v-model="form.owner"/></div>
        <div style="grid-column:1/-1"><label>产出链接</label><input v-model="form.outputLink" placeholder="https://..."/></div>
        <div style="grid-column:1/-1"><label>设计要点</label><textarea v-model="form.designPoints"></textarea></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submit">+ 添加计划</button></div>
      </div>
    </div>
    <div class="card">
      <h3 style="font-size:14px;margin-bottom:8px">排期列表（{{ rows.length }}）</h3>
      <div v-for="r in rows" :key="r.id" style="border-top:1px solid var(--line);padding:10px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:600;font-size:13px">{{ r.title }}</p>
          <p style="font-size:11px;color:var(--sub);margin-top:2px">{{ r.startDate?.slice(0,10) }} → {{ r.endDate?.slice(0,10) }} · {{ r.owner || '—' }} · <a v-if="r.outputLink" :href="r.outputLink" target="_blank" style="color:var(--pri)">产出</a></p>
        </div>
        <span class="tag t-purple">{{ r.stage }}</span>
        <span class="tag" :class="r.status==='已完成'?'t-green':r.status==='进行中'?'t-blue':'t-gray'">{{ r.status }}</span>
        <button class="btn-sm btn-ghost" @click="remove(r)">删</button>
      </div>
      <p v-if="!rows.length" style="text-align:center;color:var(--sub);padding:20px">暂无排期</p>
    </div>
  </div>
</template>
