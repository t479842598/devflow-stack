import { defineStore } from 'pinia'
import { api } from '../api/client'
import type { Project } from '../types'

export const useAppStore = defineStore('app', {
  state: () => ({
    token: localStorage.getItem('devflow_token') || '',
    user: null as any,
    projects: [] as Project[],
    currentProject: null as Project | null,
    loading: false,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    activeProjects: (s) => s.projects.filter(p => !['已交付'].includes(p.status)),
  },
  actions: {
    async login(username: string, password: string) {
      const res = await api.auth.login({ username, password })
      this.token = res.access_token
      this.user = res.user
      localStorage.setItem('devflow_token', this.token)
    },
    logout() {
      this.token = ''
      this.user = null
      this.projects = []
      this.currentProject = null
      localStorage.removeItem('devflow_token')
    },
    async fetchProjects() {
      this.loading = true
      try {
        const res = await api.projects.list()
        this.projects = res.items || []
      } finally {
        this.loading = false
      }
    },
    async setCurrentProject(id: string) {
      this.currentProject = await api.projects.get(id)
    },
    async updateProject(id: string, body: any) {
      const updated = await api.projects.update(id, body)
      const idx = this.projects.findIndex(p => p.id === id)
      if (idx > -1) this.projects[idx] = updated
      if (this.currentProject?.id === id) this.currentProject = updated
      return updated
    },
  }
})
