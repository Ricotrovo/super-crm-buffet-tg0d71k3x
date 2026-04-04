import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider } from '@/hooks/use-auth'

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
import Employees from './pages/adm/Employees'
import Suppliers from './pages/adm/Suppliers'
import Freelancers from './pages/adm/Freelancers'
import SignaturePage from './pages/contracts/SignaturePage'

import Menus from './pages/adm/Menus'
import Products from './pages/adm/Products'
import Supplies from './pages/adm/Supplies'
import Outsourced from './pages/adm/Outsourced'
import Kitchen from './pages/kitchen/Kitchen'
import Checklist from './pages/operational/Checklist'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/assinatura/:contractId" element={<SignaturePage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/contratos" element={<Contracts />} />
              <Route path="/financeiro" element={<Financial />} />
              <Route path="/estoque" element={<Inventory />} />
              <Route path="/equipe" element={<Team />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/adm/funcionarios" element={<Employees />} />
              <Route path="/adm/fornecedores" element={<Suppliers />} />
              <Route path="/adm/freelancers" element={<Freelancers />} />
              <Route path="/adm/cardapios" element={<Menus />} />
              <Route path="/adm/produtos" element={<Products />} />
              <Route path="/adm/insumos" element={<Supplies />} />
              <Route path="/adm/terceirizados" element={<Outsourced />} />
              <Route path="/cozinha" element={<Kitchen />} />
              <Route path="/checklist" element={<Checklist />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
