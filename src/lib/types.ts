export type Role = 'Admin' | 'Gerente' | 'Freelancer'

export interface User {
  id: string
  name: string
  role: Role
  email?: string
  password?: string
  avatar?: string
}

export type LeadStage = 'Novo' | 'Qualificado' | 'Agendado' | 'Contrato' | 'Perdido'

export interface Lead {
  id: string
  name: string
  source: 'WhatsApp' | 'Instagram' | 'Facebook'
  phone: string
  stage: LeadStage
  daysInStage: number
  createdAt: string
  aiSummary?: string
}

export type Hall = 'Salão Premium' | 'Salão Kids&Teens'

export interface Event {
  id: string
  clientId: string
  clientName: string
  contractNumber?: string
  menu?: string
  date: string
  time: string
  hall: Hall
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
  basePrice: number
  extraGuests: number
  extraRate: number
  optionals: number
  clientNationality?: string
  clientMaritalStatus?: string
  clientRg?: string
  clientCpf?: string
  clientAddress?: string
  clientEmail?: string
  clientPhone?: string
  birthdayPersonName?: string
  birthdayPersonAge?: number
  eventDate?: string
  eventTimeStart?: string
  eventTimeEnd?: string
  eventHall?: string
  guestCount?: number
  decorationTheme?: string
  specialInclusions?: string
  alcoholicDrinksIncluded?: boolean
  paymentMethodDescription?: string
  imageRightsGranted?: boolean
  signatureStatus?: 'Rascunho' | 'Pendente de Assinatura' | 'Assinado'
  signedAt?: string
  signerIp?: string
  witness1Name?: string
  witness1Cpf?: string
  witness2Name?: string
  witness2Cpf?: string
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

export interface Expense {
  id: string
  description: string
  value: number
  date: string
  category: 'Freelancer' | 'Insumos' | 'Custos Fixos'
  status: 'Pendente' | 'Pago'
}

export interface Recipe {
  id: string
  snackName: string
  ingredients: { inventoryId: string; quantity: number }[]
}

export interface InventoryItem {
  id: string
  name: string
  category: 'Insumo' | 'Salgado' | 'Bebida' | 'Descartável'
  location: 'Estoque Geral' | 'Câmara Fria' | 'Freezer' | 'Evento'
  currentStock: number
  minStock: number
  unit: string
}

export interface TeamMember {
  id: string
  name: string
  role: 'Monitor' | 'Garçom' | 'Cozinha' | 'Decorador'
  phone: string
}

export interface Employee {
  id: string
  name: string
  cpf?: string
  registrationId: string
  documents: string
  address: string
  cep?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  role: string
  baseSalary: number
  accessLevel: Role
}

export interface SupplierProduct {
  id: string
  name: string
  cost: number
}

export interface Supplier {
  id: string
  companyName: string
  cnpjCpf?: string
  contactInfo: string
  category: string
  subCategory: string
  productsOffered: string
  priceTable: string
  products?: SupplierProduct[]
}

export interface FreelancerRole {
  role: string
  payRate: number
}

export interface Freelancer {
  id: string
  name: string
  cpf?: string
  contactInfo: string
  address?: string
  cep?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  guardianName?: string
  guardianContact?: string
  roles: FreelancerRole[]
}

export interface Escala {
  id: string
  eventId: string
  memberId: string
  status: 'Pendente' | 'Confirmado' | 'Recusado'
  checkIn?: string
  checkOut?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}
