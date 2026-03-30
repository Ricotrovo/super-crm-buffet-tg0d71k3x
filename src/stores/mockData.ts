import {
  Lead,
  Event,
  Contract,
  FinancialInstallment,
  InventoryItem,
  TeamMember,
  AuditLog,
  Expense,
  Recipe,
  Escala,
  Employee,
  Supplier,
  Freelancer,
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
    aiSummary: 'Festa de 5 anos, 50 pessoas, orçamento R$ 4000. Tema: Princesas.',
  },
  {
    id: '2',
    name: 'João Santos',
    source: 'Instagram',
    phone: '(11) 98888-2222',
    stage: 'Qualificado',
    daysInStage: 3,
    createdAt: '2023-09-28',
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    source: 'Facebook',
    phone: '(11) 97777-3333',
    stage: 'Agendado',
    daysInStage: 5,
    createdAt: '2023-09-25',
  },
]

export const mockEvents: Event[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Família Souza',
    contractNumber: '8000',
    menu: 'Festa Kids Tradicional',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    hall: 'Salão Premium',
    status: 'Confirmado',
    guests: 50,
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Pedro Aniversário',
    contractNumber: '8001',
    menu: 'Teen Party Snacks',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    hall: 'Salão Kids&Teens',
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
    basePrice: 5500,
    extraGuests: 0,
    extraRate: 0,
    optionals: 0,
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
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'Atrasado',
  },
]

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Compra de Insumos',
    value: 1200,
    date: new Date().toISOString().split('T')[0],
    category: 'Insumos',
    status: 'Pago',
  },
]

export const mockInventory: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Farinha de Trigo',
    category: 'Insumo',
    location: 'Estoque Geral',
    currentStock: 50,
    minStock: 20,
    unit: 'kg',
  },
  {
    id: 'i2',
    name: 'Frango Desfiado',
    category: 'Insumo',
    location: 'Câmara Fria',
    currentStock: 10,
    minStock: 15,
    unit: 'kg',
  },
  {
    id: 's1',
    name: 'Coxinha',
    category: 'Salgado',
    location: 'Freezer',
    currentStock: 500,
    minStock: 1000,
    unit: 'unidades',
  },
]

export const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    snackName: 'Coxinha (100 un)',
    ingredients: [
      { inventoryId: 'i1', quantity: 1 },
      { inventoryId: 'i2', quantity: 2 },
    ],
  },
]

export const mockTeam: TeamMember[] = [
  { id: '1', name: 'Lucas Monitor', role: 'Monitor', phone: '(11) 91111-0000' },
  { id: '2', name: 'Fernanda Garçom', role: 'Garçom', phone: '(11) 92222-0000' },
  { id: '3', name: 'Roberto Cozinha', role: 'Cozinha', phone: '(11) 93333-0000' },
]

export const mockEscalas: Escala[] = [
  {
    id: 'e1',
    eventId: '1',
    memberId: '1',
    status: 'Pendente',
  },
]

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Carlos Gerente',
    registrationId: 'EMP001',
    documents: 'CPF: 111.222.333-44',
    address: 'Rua A, 123, Centro, São Paulo - SP',
    role: 'Gerente Geral',
    baseSalary: 5000,
    accessLevel: 'Gerente',
  },
]

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'Bebidas e Cia',
    contactInfo: '(11) 9999-8888',
    category: 'Bebidas',
    subCategory: 'Refrigerantes',
    productsOffered: 'Coca-cola, Guaraná, Sucos',
    priceTable: 'Tabela 2023 anexada',
  },
]

export const mockFreelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Lucas Silva',
    contactInfo: '(11) 97777-6666',
    guardianName: 'Maria Silva',
    guardianContact: '(11) 98888-7777',
    roles: [
      { role: 'Garçom', payRate: 100 },
      { role: 'Monitor', payRate: 120 },
    ],
  },
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
