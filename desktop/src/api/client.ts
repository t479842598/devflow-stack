const BASE = import.meta.env.VITE_API_BASE || '/api/v1'

export class ApiError extends Error {
  status: number
  body?: unknown
  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const token = localStorage.getItem('devflow_token')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text()
    let body: unknown
    try { body = JSON.parse(text) } catch { body = text }
    throw new ApiError(res.statusText, res.status, body)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface ListParams {
  skip?: number
  take?: number
  search?: string
  isFinal?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  projectId?: string
  [key: string]: string | number | boolean | undefined
}

function qs<T extends ListParams>(p?: T) {
  if (!p) return ''
  const q = new URLSearchParams()
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v))
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

export const api = {
  auth: {
    login: (body: { username: string; password: string }) => request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: { username: string; password: string; nickname?: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    profile: () => request('/auth/profile'),
  },
  projects: {
    list: (p?: ListParams) => request<{ items: any[]; meta: any }>(`/projects${qs(p)}`),
    get: (id: string) => request<any>(`/projects/${id}`),
    search: (q: string) => request<any[]>(`/projects/search?q=${encodeURIComponent(q)}`),
    create: (body: any) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),
  },
  techOptions: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/options${qs(p)}`),
    create: (body: any) => request('/options', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/options/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/options/${id}`, { method: 'DELETE' }),
  },
  requirements: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/requirements${qs(p)}`),
    create: (body: any) => request('/requirements', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/requirements/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/requirements/${id}`, { method: 'DELETE' }),
  },
  designs: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/designs${qs(p)}`),
    create: (body: any) => request('/designs', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/designs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/designs/${id}`, { method: 'DELETE' }),
  },
  frontends: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/fes${qs(p)}`),
    create: (body: any) => request('/fes', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/fes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/fes/${id}`, { method: 'DELETE' }),
  },
  backends: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/bes${qs(p)}`),
    create: (body: any) => request('/bes', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/bes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/bes/${id}`, { method: 'DELETE' }),
  },
  envs: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/envs${qs(p)}`),
    create: (body: any) => request('/envs', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/envs/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/envs/${id}`, { method: 'DELETE' }),
  },
  deliveries: {
    list: (p?: ListParams & { projectId?: string }) => request<{ items: any[]; meta: any }>(`/dels${qs(p)}`),
    create: (body: any) => request('/dels', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/dels/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/dels/${id}`, { method: 'DELETE' }),
  },
  ai: {
    suggest: (body: { category: string; scale?: string; specialRequirements?: string }) =>
      request<any>('/ai-prompt/suggest', { method: 'POST', body: JSON.stringify(body) }),
  },
}
