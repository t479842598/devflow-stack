// api-client.js —— Vue3 工作台对 NestJS 后端的最小调用层
// 使用方式：
//   <script src="./api-client.js"></script>
//   <script>
//     const api = new TechFlowApi({ baseURL: 'http://localhost:3000/api', token: '<jwt>' });
//     const projs = await api.getProjects();
//   </script>

(function (global) {
  class TechFlowApi {
    constructor({ baseURL, token }) {
      this.baseURL = baseURL.replace(/\/$/, '');
      this.token = token;
    }
    setToken(token) { this.token = token; }

    async req(path, opts) {
      const headers = Object.assign(
        { 'Content-Type': 'application/json' },
        opts && opts.headers,
      );
      if (this.token) headers.Authorization = 'Bearer ' + this.token;
      const res = await fetch(this.baseURL + path, {
        method: (opts && opts.method) || 'GET',
        headers,
        body: opts && opts.body ? JSON.stringify(opts.body) : undefined,
      });
      if (res.status === 401) throw new Error('未登录或 token 已过期');
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(res.status + ': ' + txt);
      }
      return res.json();
    }

    // ---- 认证 ----
    login(username, password) {
      return this.req('/auth/login', { method: 'POST', body: { username, password } });
    }
    profile() { return this.req('/auth/profile'); }
    seedAdmin() { return this.req('/auth/seed-admin', { method: 'POST' }); }

    // ---- Project ----
    getProjects(query) {
      const qs = query ? '?' + new URLSearchParams(query).toString() : '';
      return this.req('/projects' + qs);
    }
    getProject(id) { return this.req('/projects/' + id); }
    createProject(data) { return this.req('/projects', { method: 'POST', body: data }); }
    updateProject(id, data) { return this.req('/projects/' + id, { method: 'PATCH', body: data }); }
    deleteProject(id) { return this.req('/projects/' + id, { method: 'DELETE' }); }

    // ---- 需求 ----
    getRequirements(query) {
      const qs = query ? '?' + new URLSearchParams(query).toString() : '';
      return this.req('/requirements' + qs);
    }
    createRequirement(data) { return this.req('/requirements', { method: 'POST', body: data }); }
    updateRequirement(id, data) { return this.req('/requirements/' + id, { method: 'PATCH', body: data }); }

    // ---- 技术选型 ----
    getOptions(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/options' + qs); }
    createOption(data) { return this.req('/options', { method: 'POST', body: data }); }
    updateOption(id, data) { return this.req('/options/' + id, { method: 'PATCH', body: data }); }

    // ---- 设计计划 ----
    getDesigns(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/designs' + qs); }
    createDesign(data) { return this.req('/designs', { method: 'POST', body: data }); }
    updateDesign(id, data) { return this.req('/designs/' + id, { method: 'PATCH', body: data }); }

    // ---- 前端样式 ----
    getFes(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/fes' + qs); }
    createFe(data) { return this.req('/fes', { method: 'POST', body: data }); }
    updateFe(id, data) { return this.req('/fes/' + id, { method: 'PATCH', body: data }); }

    // ---- 后端框架 ----
    getBes(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/bes' + qs); }
    createBe(data) { return this.req('/bes', { method: 'POST', body: data }); }
    updateBe(id, data) { return this.req('/bes/' + id, { method: 'PATCH', body: data }); }

    // ---- 环境与联调 ----
    getEnvs(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/envs' + qs); }
    createEnv(data) { return this.req('/envs', { method: 'POST', body: data }); }
    updateEnv(id, data) { return this.req('/envs/' + id, { method: 'PATCH', body: data }); }

    // ---- 交付管理 ----
    getDels(query) { const qs = query ? '?' + new URLSearchParams(query).toString() : ''; return this.req('/dels' + qs); }
    createDel(data) { return this.req('/dels', { method: 'POST', body: data }); }
    updateDel(id, data) { return this.req('/dels/' + id, { method: 'PATCH', body: data }); }

    // ---- AI 提示词 ----
    getProjectPrompt(projectId) { return this.req('/ai-prompt/project/' + projectId); }
    getAiRecommend(scene) { return this.req('/ai-prompt/recommend/' + encodeURIComponent(scene)); }
  }

  global.TechFlowApi = TechFlowApi;
})(typeof window !== 'undefined' ? window : this);
/* eslint-enable */
