import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'

import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Leads from './pages/leads/Leads'
import Agenda from './pages/agenda/Agenda'
import Contracts from './pages/contracts/Contracts'
import Financial from './pages/financial/Financial'
import Inventory from './pages/inventory/Inventory'
import Team from './pages/team/Team'
import Reports from './pages/reports/Reports'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/contratos" element={<Contracts />} />
            <Route path="/financeiro" element={<Financial />} />
            <Route path="/estoque" element={<Inventory />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/relatorios" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
