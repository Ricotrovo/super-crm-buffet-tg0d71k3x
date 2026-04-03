import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError('')
    setLoading(true)
    try {
      const { error: signInError } = await signIn(values.email, values.password)
      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Email ou senha inválidos')
        } else {
          setError(signInError.message)
        }
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-2">
            T
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Tribo da Folia</CardTitle>
          <CardDescription>Faça login para acessar o CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Esqueci senha
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t text-xs text-muted-foreground text-center space-y-1.5 bg-muted/30 p-4 rounded-md">
            <p className="font-semibold text-foreground mb-2">Contas de Teste:</p>
            <p>Admin: admin@tribo.com / password123</p>
            <p>Gerente: gerente@tribo.com / password123</p>
            <p>Freelancer: free@tribo.com / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
