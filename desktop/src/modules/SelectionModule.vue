<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../api/client'
import { useAppStore } from '../store/app'
const app = useAppStore()
const items = ref<any[]>([])
const aiOut = ref('')
const loading = ref(false)

const finalOpt = computed(()=>items.value.find(o=>o.isFinal))
const pid = computed(()=>app.currentProject?.id)

async function load(){
  if(!pid.value) return
  const r = await api.techOptions.list({ projectId: pid.value, take: 200 })
  items.value = r.items
}
async function markFinal(o:any){
  await api.techOptions.update(o.id,{isFinal:!o.isFinal})
  await load()
}
async function remove(o:any){
  await api.techOptions.remove(o.id)
  await load()
}
async function genAI(){
  if(!app.currentProject) return
  loading.value = true
  aiOut.value = '生成中…'
  try{
    const r = await api.ai.suggest({ category: app.currentProject.category, scale: app.currentProject.scale })
    aiOut.value = `【AI 推荐 · ${app.currentProject.category}】\n\n${r.candidates?.map((c:any,i:number)=>`${i+1}. ${c.front} + ${c.back}（综合 ${c.score}）\n  优点：${c.advantages}\n  风险：${c.risks}`).join('\n\n') || JSON.stringify(r)}`
  }catch(e:any){
    aiOut.value = '调用失败：' + (e?.message || '未知错误')
  }finally{loading.value=false}
}
function copyAI(){
  navigator.clipboard.writeText(aiOut.value).then(()=>alert('已复制到剪贴板'))
}
onMounted(load)
</script>

<template>
  <div>
    <div class="card">
      <h3 style="display:flex;align-items:center;gap:8px;font-size:16px"><span class="tag t-blue">1</span>技术选型中心</h3>
      <p style="font-size:12px;color:var(--sub);margin-top:4px">
        为「{{ app.currentProject?.name }}」（类别：{{ app.currentProject?.category }}）做前端/后端框架对比。
      </p>
      <div class="ai-panel">
        <h4>
          <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 9l-6.1 1.2L12 16l-1.9-5.8L4 9l6.1-1.2L12 2z"/></svg>
          AI 规划助手 · 选型推荐
        </h4>
        <div class="ai-actions">
          <button class="btn-sm btn-ai" @click="genAI" :disabled="loading">{{ loading?'生成中…':'按场景推荐' }}</button>
          <button class="btn-sm btn-ghost" @click="copyAI" :disabled="!aiOut">复制提示词</button>
        </div>
        <div class="ai-box" :class="{show:!!aiOut}">{{ aiOut }}</div>
      </div>
      <div v-if="finalOpt" class="card" style="background:#fffbf1;border-color:#f5b942;margin-top:10px">
        <p style="font-size:12px;color:var(--orange);font-weight:600">⭐ 最终选型</p>
        <p style="margin-top:6px;font-size:14px;font-weight:600">{{ finalOpt.frontStack }} + {{ finalOpt.backStack }}</p>
        <p style="font-size:11px;color:var(--sub);margin-top:4px">综合评分 {{ finalOpt.weightedScore }} · 优点：{{ finalOpt.advantages || '—' }}</p>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:14px">候选方案对比（按综合分排序）</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">
        <thead><tr style="text-align:left;font-size:12px;color:var(--sub);border-bottom:2px solid var(--line)">
          <th style="padding:8px">前端</th><th style="padding:8px">后端</th>
          <th style="padding:8px">效率</th><th style="padding:8px">性能</th>
          <th style="padding:8px">维护</th><th style="padding:8px">匹配</th>
          <th style="padding:8px">综合</th><th style="padding:8px">操作</th>
        </tr></thead>
        <tbody>
          <tr v-for="o in [...items].sort((a,b)=>b.weightedScore-a.weightedScore)" :key="o.id" style="border-bottom:1px solid var(--line)">
            <td style="padding:8px;font-weight:600">{{ o.frontStack }}</td>
            <td style="padding:8px">{{ o.backStack }}</td>
            <td style="padding:8px">{{ o.scoreEfficiency }}</td>
            <td style="padding:8px">{{ o.scorePerformance }}</td>
            <td style="padding:8px">{{ o.scoreMaintainCost }}</td>
            <td style="padding:8px">{{ o.scoreBackendMatch }}</td>
            <td style="padding:8px"><span class="tag t-blue">{{ o.weightedScore }}</span></td>
            <td style="padding:8px">
              <button class="btn-sm btn-green" @click="markFinal(o)">{{ o.isFinal?'取消最终':'标为最终' }}</button>
              <button class="btn-sm btn-ghost" @click="remove(o)" style="margin-left:6px">删</button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="8" style="padding:24px;text-align:center;color:var(--sub)">暂无对比项，点上方「按场景推荐」让 AI 生成对比</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
