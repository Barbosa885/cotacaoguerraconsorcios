'use client'

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'sonner';

import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

    const handleGoogleLogin = async () => {
      toast.loading("Redirecionando para o Google...", {
        description: "Você será enviado para a página de login do Google para continuar.",
      });
      // Inicia o fluxo de login com o Google.
      await signIn('google', {callbackUrl: '/'});
    }

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="bg-gradient-to-br from-blue-200 via-white to-gray-200 min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-gray-200 min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Image src="/imgs/GG-PRETO.png" alt="Logo" width={180} height={45} />
        </div>

        <Card className="shadow-md text-center">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl font-bold">Acesse a Plataforma</CardTitle>
            <CardDescription className="w-full" >Use sua conta do Google para uma experiência completa.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 text-base">
              <FcGoogle className="mr-3 h-5 w-5" />
              Entrar com Google
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400 space-x-4">
          <Link href="#" className="hover:underline hover:text-gray-600">Termos de Uso</Link>
          <span>•</span>
          <Link href="#" className="hover:underline hover:text-gray-600">Política de Privacidade</Link>
          <span>•</span>
          <Link href="#" className="hover:underline hover:text-gray-600">Feito com carinho {'<3'}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
