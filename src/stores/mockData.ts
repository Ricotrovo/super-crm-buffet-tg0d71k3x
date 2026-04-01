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
  MenuConfig,
  Product,
  EventSupply,
  OutsourcedService,
  KitchenTask,
  EventChecklist,
} from '@/lib/types'

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Maria Silva',
    source: 'WhatsApp',
    phone: '(11) 99999-1111',
    mobilePhone: '(11) 99999-1111',
    email: 'maria@example.com',
    stage: 'Novo',
    daysInStage: 1,
    createdAt: '2023-10-01',
    aiSummary: 'Festa de 5 anos, 50 pessoas, orçamento R$ 4000. Tema: Princesas.',
    score: 9,
    children: [{ id: 'c1', name: 'Julia', birthDate: '2019-05-10' }],
    eventDate: '2024-05-10',
    guestCount: 50,
  },
  {
    id: '2',
    name: 'João Santos',
    source: 'Instagram',
    phone: '(11) 98888-2222',
    mobilePhone: '(11) 98888-2222',
    stage: 'Qualificado',
    daysInStage: 3,
    createdAt: '2023-09-28',
    score: 6,
    hasVisited: true,
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    source: 'Facebook',
    phone: '(11) 97777-3333',
    mobilePhone: '(11) 97777-3333',
    stage: 'Agendado',
    daysInStage: 5,
    createdAt: '2023-09-25',
    score: 10,
    hasVisited: true,
    hasTasted: true,
  },
]

export const mockEvents: Event[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Família Souza',
    contractNumber: '8000',
    menu: 'Festa Kids Tradicional',
    menuId: '1',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    hall: 'Salão Premium',
    status: 'Confirmado',
    guests: 50,
    selectedOptionals: ['Pintura Facial'],
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Pedro Aniversário',
    contractNumber: '8001',
    menu: 'Teen Party Snacks',
    menuId: '2',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    hall: 'Salão Kids&Teens',
    status: 'Confirmado',
    guests: 80,
    selectedOptionals: [],
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
    signatureStatus: 'Pendente de Assinatura',
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
    role: 'Monitor',
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

export const mockMenuConfigs: MenuConfig[] = [
  {
    id: '1',
    name: 'Festa Kids Tradicional',
    price50Guests: 5500,
    extraGuestPre: 90,
    extraGuestDay: 120,
    baseStaff: [
      { role: 'Monitor', quantity: 2 },
      { role: 'Garçom', quantity: 2 },
      { role: 'Cozinha', quantity: 1 },
    ],
    scalingRules: [
      { guestThreshold: 60, role: 'Garçom', extraQuantity: 1 },
      { guestThreshold: 80, role: 'Monitor', extraQuantity: 1 },
    ],
    optionalItems: [
      {
        id: 'opt1',
        name: 'Pintura Facial',
        price: 200,
        triggersExtraStaff: true,
        staffRole: 'Animador',
      },
      { id: 'opt2', name: 'Decoração Premium', price: 1000, triggersExtraStaff: false },
    ],
  },
  {
    id: '2',
    name: 'Teen Party Snacks',
    price50Guests: 6500,
    extraGuestPre: 110,
    extraGuestDay: 150,
    baseStaff: [
      { role: 'Monitor', quantity: 1 },
      { role: 'Garçom', quantity: 3 },
      { role: 'Cozinha', quantity: 2 },
    ],
    scalingRules: [{ guestThreshold: 70, role: 'Garçom', extraQuantity: 1 }],
    optionalItems: [
      {
        id: 'opt3',
        name: 'DJ Profissional',
        price: 800,
        triggersExtraStaff: true,
        staffRole: 'Animador',
      },
    ],
  },
]

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Farinha de Trigo 1kg',
    supplier: 'Fornecedor A',
    category: 'Insumos Básicos',
    currentStock: 20,
  },
  {
    id: 'p2',
    name: 'Refrigerante Cola 2L',
    supplier: 'Bebidas e Cia',
    category: 'Bebidas',
    currentStock: 50,
  },
  {
    id: 'p3',
    name: 'Copo Descartável 200ml',
    supplier: 'Embalagens XYZ',
    category: 'Descartáveis',
    currentStock: 1000,
  },
]

export const mockEventSupplies: EventSupply[] = [
  { id: 'es1', eventId: '1', productId: 'p2', quantity: 10 },
  { id: 'es2', eventId: '1', productId: 'p3', quantity: 200 },
]

export const mockOutsourced: OutsourcedService[] = [
  {
    id: 'os1',
    eventId: '1',
    type: 'Bolo',
    description: 'Bolo de Chocolate 5kg',
    cost: 350,
    supplier: 'Confeitaria Doce Sabor',
    date: new Date().toISOString().split('T')[0],
    status: 'Pendente',
  },
  {
    id: 'os2',
    eventId: '1',
    type: 'Tema',
    description: 'Decoração Princesas Mágicas',
    cost: 1200,
    supplier: 'Decora Festas',
    date: new Date().toISOString().split('T')[0],
    status: 'Pago',
  },
]

export const mockKitchenTasks: KitchenTask[] = [
  { id: 'kt1', eventId: '1', itemName: 'Coxinha (100 un)', quantity: 5, status: 'Pendente' },
  { id: 'kt2', eventId: '1', itemName: 'Mini Pizza', quantity: 200, status: 'Concluído' },
]

export const mockEventChecklists: EventChecklist[] = [
  {
    eventId: '1',
    items: [
      { id: 'c1', task: 'Verificar limpeza do salão', isChecked: true },
      { id: 'c2', task: 'Testar som e iluminação', isChecked: false },
      { id: 'c3', task: 'Confirmar entrega do bolo', isChecked: false },
      { id: 'c4', task: 'Checar uniforme da equipe', isChecked: false },
    ],
  },
]
