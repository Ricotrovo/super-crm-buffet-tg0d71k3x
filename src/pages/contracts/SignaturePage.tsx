import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { ContractPrintView } from './ContractPrintView'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PenTool, CheckCircle, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SignaturePage() {
  const { contractId } = useParams()
  const { contracts, updateContract } = useAppStore()
  const { toast } = useToast()

  const [contract, setContract] = useState(contracts.find((c) => c.id === contractId))
  const [witness1Name, setWitness1Name] = useState('')
  const [witness1Cpf, setWitness1Cpf] = useState('')
  const [witness2Name, setWitness2Name] = useState('')
  const [witness2Cpf, setWitness2Cpf] = useState('')
  const [isSigning, setIsSigning] = useState(false)

  useEffect(() => {
    setContract(contracts.find((c) => c.id === contractId))
  }, [contracts, contractId])

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Contrato não encontrado</CardTitle>
            <CardDescription>O link pode estar quebrado ou expirado.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleSign = async () => {
    setIsSigning(true)
    // Mock IP fetch
    const mockIp = `177.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255,
    )}.${Math.floor(Math.random() * 255)}`

    const signatureData = {
      signatureStatus: 'Assinado' as const,
      signedAt: new Date().toISOString(),
      signerIp: mockIp,
      witness1Name,
      witness1Cpf,
      witness2Name,
      witness2Cpf,
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    updateContract(contract.id, signatureData)
    toast({
      title: 'Contrato Assinado com Sucesso!',
      description: 'Obrigado por assinar digitalmente.',
    })
    setIsSigning(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none">
        <div className="text-center print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">Portal de Assinatura</h1>
          <p className="mt-2 text-gray-600">Revise e assine seu contrato com a Tribo da Folia</p>
        </div>

        {contract.signatureStatus === 'Assinado' ? (
          <Card className="border-green-200 bg-green-50 shadow-sm print:hidden">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-800">Contrato Assinado!</h2>
              <p className="text-green-700">
                Este contrato foi assinado digitalmente em{' '}
                {new Date(contract.signedAt || '').toLocaleString('pt-BR')}.
              </p>
              <Button onClick={handlePrint} variant="outline" className="mt-4 bg-white">
                <Download className="w-4 h-4 mr-2" /> Baixar Cópia (PDF)
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg print:hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Preencha os dados e assine</CardTitle>
              <CardDescription>
                Ao clicar em assinar, você concorda com todos os termos do contrato abaixo. Seu IP e
                horário serão registrados para validade jurídica.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-sm text-gray-700">Testemunha 1 (Opcional)</h3>
                  <div>
                    <Label>Nome Completo</Label>
                    <Input
                      value={witness1Name}
                      onChange={(e) => setWitness1Name(e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <Input
                      value={witness1Cpf}
                      onChange={(e) => setWitness1Cpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-sm text-gray-700">Testemunha 2 (Opcional)</h3>
                  <div>
                    <Label>Nome Completo</Label>
                    <Input
                      value={witness2Name}
                      onChange={(e) => setWitness2Name(e.target.value)}
                      placeholder="Ex: Maria Souza"
                    />
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <Input
                      value={witness2Cpf}
                      onChange={(e) => setWitness2Cpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6"
                  onClick={handleSign}
                  disabled={isSigning}
                >
                  <PenTool className="w-5 h-5 mr-2" />
                  {isSigning ? 'Assinando e Registrando...' : 'Assinar Digitalmente Agora'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border print:border-none print:shadow-none print:rounded-none">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center print:hidden">
            <h2 className="font-semibold text-gray-700">Visualização do Documento</h2>
            <Button variant="ghost" size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
          <div className="p-4 sm:p-8 overflow-x-auto print:p-0 print:overflow-visible">
            <div className="max-w-[800px] mx-auto border shadow-sm p-4 sm:p-8 bg-white min-w-[600px] print:border-none print:shadow-none print:p-0 print:min-w-0 print:max-w-none">
              <ContractPrintView contract={contract} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
