'use client'
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile quando redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll quando menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignIn = async () => {
    closeMobileMenu();

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

  const handleSignOut = async () => {
    closeMobileMenu();

    toast.loading("Carregando...", {
      description: "Estamos te deslogando."
    })

    try {
      await signOut();
      toast.success("Deslogado com sucesso!")
    } catch(error) {
      console.error("Erro ao deslogar: ", error)
      toast.error("Houve um problema ao deslogar", {
        description: "Não foi possível deslogar sua conta. Tente novamente."
      })
    }
  }

  return (
      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4">
        <div className="pt-2 sm:pt-3">
          <nav className={`
            mx-auto max-w-7xl
            bg-white/90 backdrop-blur-md
            rounded-xl sm:rounded-2xl border border-gray-200/50
            transition-all duration-300 ease-in-out
            ${isScrolled 
              ? 'shadow-lg shadow-black/5 bg-white/95' 
              : 'shadow-sm'
            }
          `}>
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                onClick={closeMobileMenu}
              >
                <Image 
                  src="/imgs/AvaliaCarLogo.svg" 
                  alt="AvaliaCar Logo" 
                  width={120} 
                  height={32} 
                  className="h-6 sm:h-8 w-auto"
                />
              </Link>
              
              {/* Navegação web */}
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/consulta-fipe">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 py-2 font-medium text-sm"
                  >
                    Consulta FIPE
                  </Button>
                </Link>
                <Link href="/avaliacao-simulacao">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 py-2 font-medium text-sm"
                  >
                    Avalie & Simule
                  </Button>
                </Link>
                <Link href="/classificados" onClick={closeMobileMenu}>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 py-2 font-medium text-sm"
                  >
                    Veículos
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 py-2 font-medium text-sm"
                  >
                    Fale Conosco
                  </Button>
                </Link>
              </div>
              
              {/* Web CTA */}
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                {status === 'loading' && (
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-9 w-20 rounded-xl" />
                    <Skeleton className="h-9 w-24 rounded-xl" />
                  </div>
                )}
                {status === 'unauthenticated' && (
                  <>
                    <Link href="/login">
                      <Button 
                        variant="ghost" 
                        className="hidden lg:inline-flex text-gray-600 hover:text-gray-900 text-sm px-3"
                      >
                        Login
                      </Button>
                    </Link>
                    <Button 
                      className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-4 lg:px-6 py-2 font-medium shadow-sm text-sm"
                    >
                      Começar!
                    </Button>
                  </>
                )}
                {status === 'authenticated' && session.user && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name ?? 'Avatar'}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" align="end">
                      <div className="p-2 border-b">
                        <p className="font-semibold text-sm truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <div className="p-1">
                        <Button variant="ghost" className="w-full justify-start text-sm font-normal text-red-500" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Botão de Menu Mobile */}
              <div className="md:hidden flex items-center space-x-2">
                {status === 'unauthenticated' && (
                  <Link href="/login">
                    <Button 
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 py-1.5 font-medium shadow-sm text-sm"
                    >
                      Login
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-gray-700" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-700" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Mobile */}
          <div className="fixed left-3 right-3 bg-white rounded-xl border border-gray-200 shadow-xl" style={{ top: 'calc(3rem + 8px)' }}>
            <div className="p-4 space-y-1">
              {status === 'authenticated' && session.user && (
                <div className="px-4 py-2 border-b mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-9 w-9 rounded-full">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? 'Avatar'}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <Link href="/consulta-fipe" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                >
                  Consulta FIPE
                </Button>
              </Link>
              <Link href="/avaliacao-simulacao" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                >
                  Avalie & Simule
                </Button>
              </Link>
              <Link href="/veiculos" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                >
                  Veículos
                </Button>
              </Link>
              <Link href="/contato" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                >
                  Fale Conosco
                </Button>
              </Link>
              
              <div className="pt-2 border-t border-gray-100 mt-3">
                {status === 'authenticated' ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-3 font-medium text-base"
                      onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                    onClick={handleSignIn}
                  >
                    Entrar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
