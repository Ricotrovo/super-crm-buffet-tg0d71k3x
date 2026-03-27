export type Role = 'Admin' | 'Gerente' | 'Freelancer'

export interface User {
  id: string
  name: string
  role: Role
  email?: string
  password?: string
  avatar?: string
}

export type LeadStage = 'Novo' | 'Contatado' | 'Visita' | 'Proposta' | 'Ganho'

export interface Lead {
  id: string
  name: string
  source: 'WhatsApp' | 'Instagram' | 'Facebook'
  phone: string
  stage: LeadStage
  daysInStage: number
  createdAt: string
}

export interface Event {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  hall: 'Salão A' | 'Salão B'
  status: 'Rascunho' | 'Confirmado' | 'Concluído' | 'Cancelado'
  guests: number
}

export interface Contract {
  id: string
  number: number
  clientId: string
  clientName: string
  eventId: string
  total: number
  status: 'Ativo' | 'Finalizado'
  createdAt: string
}

export interface FinancialInstallment {
  id: string
  contractId: string
  contractNumber: number
  installmentNumber: number
  totalInstallments: number
  value: number
  dueDate: string
  status: 'Pendente' | 'Pago' | 'Atrasado'
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  unit: string
}

export interface TeamMember {
  id: string
  name: string
  role: 'Monitor' | 'Garçom' | 'Cozinha'
  phone: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}
