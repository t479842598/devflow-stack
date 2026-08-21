<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const rows = ref<any[]>([])
const envForm = ref({ name:'', scene:'开发环境', status:'未开始', owner:'', dueDate:'', note:'' })
const delForm = ref({ name:'', type:'测试用例', environment:'测试', status:'待处理', owner:'', dueDate:'', note:'' })
const pid = computed(()=>app.currentProject?.id)
const mode = ref<'env'|'del'>('env')

async function load(){
  if(!pid.value) return
  rEnv.value = (await api.envs.list({ projectId: pid.value, take:200 })).items
  rDel.value = (await api.deliveries.list({ projectId: pid.value, take:200 })).items
}
const rEnv = ref<any[]>([])
const rDel = ref<any[]>([])
const list = computed(()=> mode.value==='env'? rEnv.value: rDel.value)

async function submitEnv(){
  if(!envForm.value.name) return alert('填名称')
  await api.envs.create({ ...envForm.value, projectId: pid.value })
  envForm.value = { name:'', scene:'开发环境', status:'未开始', owner:'', dueDate:'', note:'' }
  await load()
}
async function submitDel(){
  if(!delForm.value.name) return alert('填名称')
  await api.deliveries.create({ ...delForm.value, projectId: pid.value })
  delForm.value = { name:'', type:'测试用例', environment:'测试', status:'待处理', owner:'', dueDate:'', note:'' }
  await load()
}
async function remove(r:any){
  if(mode.value==='env') await api.envs.remove(r.id); else await api.deliveries.remove(r.id)
  await load()
}
async function advance(r:any){
  const seq = mode.value==='env' ? ['未开始','进行中','已完成'] : ['待处理','进行中','已完成']
  const i = seq.indexOf(r.status)
  if(i<seq.length-1){
    if(mode.value==='env') await api.envs.update(r.id,{status:seq[i+1]}); else await api.deliveries.update(r.id,{status:seq[i+1]})
    await load()
  }
}
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">6/7</span>环境与联调 / 交付管理</h3>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn-sm" :class="mode==='env'?'btn':'btn-ghost'" @click="mode='env'">环境事项</button>
        <button class="btn-sm" :class="mode==='del'?'btn':'btn-ghost'" @click="mode='del'">交付事项</button>
      </div>

      <div v-if="mode==='env'" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div><label>事项 *</label><input v-model="envForm.name" placeholder="如：搭建 CI 流水线"/></div>
        <div><label>环节</label><select v-model="envForm.scene"><option>开发环境</option><option>测试环境</option><option>预发环境</option><option>生产环境</option><option>联调会议</option><option>代码评审</option></select></div>
        <div><label>负责人</label><input v-model="envForm.owner"/></div>
        <div><label>截止</label><input type="date" v-model="envForm.dueDate"/></div>
        <div style="grid-column:span 2"><label>备注</label><input v-model="envForm.note"/></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submitEnv">+ 添加环境事项</button></div>
      </div>

      <div v-else style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">
        <div><label>事项 *</label><input v-model="delForm.name" placeholder="如：回归测试-订单模块"/></div>
        <div><label>类型</label><select v-model="delForm.type"><option>测试用例</option><option>缺陷跟踪</option><option>部署发布</option><option>上线交付</option><option>运维交接</option></select></div>
        <div><label>环境</label><select v-model="delForm.environment"><option>开发</option><option>测试</option><option>预发</option><option>生产</option></select></div>
        <div><label>负责人</label><input v-model="delForm.owner"/></div>
        <div><label>截止</label><input type="date" v-model="delForm.dueDate"/></div>
        <div><label>备注</label><input v-model="delForm.note"/></div>
        <div style="grid-column:1/-1"><button class="btn" @click="submitDel">+ 添加交付事项</button></div>
      </div>
    </div>

    <div class="card">
      <div v-for="r in list" :key="r.id" style="border-top:1px solid var(--line);padding:10px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <p style="font-weight:600;font-size:13px">{{ r.name }}</p>
          <p style="font-size:11px;color:var(--sub)">{{ r.scene || r.type }} · {{ r.environment || '' }} · {{ r.dueDate?.slice(0,10) || '—' }}</p>
        </div>
        <span class="tag" :class="r.status==='已完成'?'t-green':r.status==='进行中'?'t-blue':'t-gray'">{{ r.status }}</span>
        <button class="btn-sm btn" @click="advance(r)" v-if="r.status!=='已完成'">推进</button>
        <button class="btn-sm btn-ghost" @click="remove(r)">删</button>
      </div>
      <p v-if="!list.length" style="text-align:center;color:var(--sub);padding:20px">暂无事项</p>
    </div>
  </div>
</template>
