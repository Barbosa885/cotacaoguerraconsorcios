'use client'

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {

    toast.loading("Carregando...", {
      description: "Estamos processando seu login com o Google.",
    });

    try {
      await signIn('google', {callbackUrl: '/'})
      toast.success("Login realizado com sucesso!", {
        description: "Você será redirecionado em breve."
      })

    } catch(error) {
      console.error("Falha no login com o Google.", error)
      toast.error("Erro ao fazer login", {
        description: "Não foi possível conectar com o Google. Tente novamente."
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '', general: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setErrors(prev => ({ ...prev, general: 'Email ou senha inválidos.' }));
    } else if (result?.ok) {
      router.push('/');
    }

    setIsLoading(false);
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <Image src="/imgs/Prancheta1GUERRAGRUPO.png" alt="Logo guerra" width={100} height={100} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center text-gray-900">Fazer Login</CardTitle>
              <CardDescription className="text-center text-gray-600">Use suas credenciais para acessar sua conta</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`} disabled={isLoading} />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-500 hover:underline">Esqueceu a senha?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`} disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <div className="flex items-center justify-center">Entrar<ArrowRight className="ml-2 h-4 w-4" /></div>}
                </Button>
              </div>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-gray-500">ou</span></div>
            </div>
            <div className="grid grid-cols-1 w-full">
              <Button onClick={handleGoogleLogin} variant="outline" className="h-11" disabled={isLoading}>
                <FcGoogle />
                Google
              </Button>
            </div>
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">Criar conta</Link>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500 space-x-4">
          <Link href="#" className="hover:text-gray-700 hover:underline">Termos de Uso</Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-700 hover:underline">Privacidade</Link>
          <span>•</span>
          <Link href="#" className="hover:text-gray-700 hover:underline">Suporte</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
