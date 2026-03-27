import {
  Lead,
  Event,
  Contract,
  FinancialInstallment,
  InventoryItem,
  TeamMember,
  AuditLog,
} from '@/lib/types'

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Maria Silva',
    source: 'WhatsApp',
    phone: '(11) 99999-1111',
    stage: 'Novo',
    daysInStage: 1,
    createdAt: '2023-10-01',
  },
  {
    id: '2',
    name: 'João Santos',
    source: 'Instagram',
    phone: '(11) 98888-2222',
    stage: 'Contatado',
    daysInStage: 3,
    createdAt: '2023-09-28',
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    source: 'Facebook',
    phone: '(11) 97777-3333',
    stage: 'Visita',
    daysInStage: 5,
    createdAt: '2023-09-25',
  },
  {
    id: '4',
    name: 'Carlos Costa',
    source: 'WhatsApp',
    phone: '(11) 96666-4444',
    stage: 'Proposta',
    daysInStage: 2,
    createdAt: '2023-09-20',
  },
]

export const mockEvents: Event[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Família Souza',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    hall: 'Salão A',
    status: 'Confirmado',
    guests: 50,
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Pedro Aniversário',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:00',
    hall: 'Salão B',
    status: 'Confirmado',
    guests: 80,
  },
]

export const mockContracts: Contract[] = [
  {
    id: '1',
    number: 8000,
    clientId: 'c1',
    clientName: 'Família Souza',
    eventId: '1',
    total: 5500,
    status: 'Ativo',
    createdAt: '2023-09-15',
  },
]

export const mockFinancials: FinancialInstallment[] = [
  {
    id: '1',
    contractId: '1',
    contractNumber: 8000,
    installmentNumber: 1,
    totalInstallments: 3,
    value: 1833.33,
    dueDate: '2023-09-15',
    status: 'Pago',
  },
  {
    id: '2',
    contractId: '1',
    contractNumber: 8000,
    installmentNumber: 2,
    totalInstallments: 3,
    value: 1833.33,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pendente',
  },
  {
    id: '3',
    contractId: '1',
    contractNumber: 8000,
    installmentNumber: 3,
    totalInstallments: 3,
    value: 1833.34,
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    status: 'Atrasado',
  },
]

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Salgados Sortidos',
    category: 'Alimentação',
    currentStock: 500,
    minStock: 1000,
    unit: 'unidades',
  },
  {
    id: '2',
    name: 'Refrigerante Cola',
    category: 'Bebidas',
    currentStock: 150,
    minStock: 100,
    unit: 'garrafas 2L',
  },
  {
    id: '3',
    name: 'Copos Plásticos',
    category: 'Descartáveis',
    currentStock: 5000,
    minStock: 2000,
    unit: 'unidades',
  },
]

export const mockTeam: TeamMember[] = [
  { id: '1', name: 'Lucas Monitor', role: 'Monitor', phone: '(11) 91111-0000' },
  { id: '2', name: 'Fernanda Garçom', role: 'Garçom', phone: '(11) 92222-0000' },
  { id: '3', name: 'Roberto Cozinha', role: 'Cozinha', phone: '(11) 93333-0000' },
]

export const mockLogs: AuditLog[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Admin',
    action: 'Contrato Criado',
    details: 'Contrato 8000 gerado',
    timestamp: '2023-09-15T10:00:00Z',
  },
]
