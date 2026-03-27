import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  User,
  Lead,
  Event,
  Contract,
  FinancialInstallment,
  InventoryItem,
  TeamMember,
  AuditLog,
} from '@/lib/types'
import {
  mockLeads,
  mockEvents,
  mockContracts,
  mockFinancials,
  mockInventory,
  mockTeam,
  mockLogs,
} from './mockData'

interface AppState {
  currentUser: User
  setCurrentUser: (user: User) => void
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  contracts: Contract[]
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>
  financials: FinancialInstallment[]
  setFinancials: React.Dispatch<React.SetStateAction<FinancialInstallment[]>>
  inventory: InventoryItem[]
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
  team: TeamMember[]
  logs: AuditLog[]
  addLog: (action: string, details: string) => void
  nextContractNumber: number
}

const AppContext = createContext<AppState | undefined>(undefined)

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Silva', role: 'Admin' },
  { id: 'u2', name: 'Gerente João', role: 'Gerente' },
  { id: 'u3', name: 'Free Lucas', role: 'Freelancer' },
]

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0])
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [financials, setFinancials] = useState<FinancialInstallment[]>(mockFinancials)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [team] = useState<TeamMember[]>(mockTeam)
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)

  const [nextContractNumber, setNextContractNumber] = useState(8001)

  const addLog = (action: string, details: string) => {
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

  // Intercept contract creation to increment number
  const handleSetContracts: React.Dispatch<React.SetStateAction<Contract[]>> = (val) => {
    setContracts(val)
    if (typeof val === 'function') {
      // not perfectly tracking sequence if function, but ok for mock
      setNextContractNumber((prev) => prev + 1)
    } else if (val.length > contracts.length) {
      setNextContractNumber((prev) => prev + 1)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        leads,
        setLeads,
        events,
        setEvents,
        contracts,
        setContracts: handleSetContracts,
        financials,
        setFinancials,
        inventory,
        setInventory,
        team,
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
