import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  User,
  Lead,
  Event,
  Contract,
  FinancialInstallment,
  Expense,
  InventoryItem,
  Recipe,
  TeamMember,
  Escala,
  AuditLog,
} from '@/lib/types'
import {
  mockLeads,
  mockEvents,
  mockContracts,
  mockFinancials,
  mockExpenses,
  mockInventory,
  mockRecipes,
  mockTeam,
  mockEscalas,
  mockLogs,
} from './mockData'

interface AppState {
  currentUser: User | null
  isAuthenticated: boolean
  login: (email: string, pass: string) => void
  logout: () => void
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  contracts: Contract[]
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>
  financials: FinancialInstallment[]
  setFinancials: React.Dispatch<React.SetStateAction<FinancialInstallment[]>>
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  inventory: InventoryItem[]
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
  recipes: Recipe[]
  team: TeamMember[]
  escalas: Escala[]
  setEscalas: React.Dispatch<React.SetStateAction<Escala[]>>
  logs: AuditLog[]
  addLog: (action: string, details: string) => void
  nextContractNumber: number
}

const AppContext = createContext<AppState | undefined>(undefined)

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Silva',
    role: 'Admin',
    email: 'admin@tribo.com',
    password: 'password123',
  },
  {
    id: 'u2',
    name: 'Gerente João',
    role: 'Gerente',
    email: 'gerente@tribo.com',
    password: 'password123',
  },
  {
    id: '1',
    name: 'Lucas Monitor',
    role: 'Freelancer',
    email: 'free@tribo.com',
    password: 'password123',
  },
]

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [financials, setFinancials] = useState<FinancialInstallment[]>(mockFinancials)
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [recipes] = useState<Recipe[]>(mockRecipes)
  const [team] = useState<TeamMember[]>(mockTeam)
  const [escalas, setEscalas] = useState<Escala[]>(mockEscalas)
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)

  const [nextContractNumber, setNextContractNumber] = useState(8001)

  const login = (email: string, pass: string) => {
    const user = MOCK_USERS.find((u) => u.email === email)
    if (!user) throw new Error('Email não registrado')
    if (user.password !== pass) throw new Error('Credenciais inválidas')
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const addLog = (action: string, details: string) => {
    if (!currentUser) return
    const newLog: AuditLog = {
      id: Math.random().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const handleSetContracts: React.Dispatch<React.SetStateAction<Contract[]>> = (val) => {
    setContracts(val)
    if (typeof val === 'function') setNextContractNumber((prev) => prev + 1)
    else if (val.length > contracts.length) setNextContractNumber((prev) => prev + 1)
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        leads,
        setLeads,
        events,
        setEvents,
        contracts,
        setContracts: handleSetContracts,
        financials,
        setFinancials,
        expenses,
        setExpenses,
        inventory,
        setInventory,
        recipes,
        team,
        escalas,
        setEscalas,
        logs,
        addLog,
        nextContractNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}

export { MOCK_USERS }
