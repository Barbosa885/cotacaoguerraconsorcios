'use client'
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
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
                <Button 
                  variant="ghost" 
                  className="hidden lg:inline-flex text-gray-600 hover:text-gray-900 text-sm px-3"
                >
                  Entrar
                </Button>
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 lg:px-6 py-2 font-medium shadow-sm text-sm"
                >
                  Login
                </Button>
              </div>

              {/* Botão de Menu Mobile */}
              <div className="md:hidden flex items-center space-x-2">
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 py-1.5 font-medium shadow-sm text-sm"
                >
                  Login
                </Button>
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
              <Link href="/contato" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                >
                  Fale Conosco
                </Button>
              </Link>
              
              <div className="pt-2 border-t border-gray-100 mt-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4 py-3 font-medium text-base"
                  onClick={closeMobileMenu}
                >
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

