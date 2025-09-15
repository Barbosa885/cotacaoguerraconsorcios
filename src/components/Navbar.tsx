import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          <Image src="/imgs/AvaliaCarLogo.svg" alt="AvaliaCar Logo" width={120} height={120} className="inline-block ml-2" />
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/cotacao">
            <Button variant="ghost">Avaliar Veículo</Button>
          </Link>
          <Link href="/contato">
            <Button variant="ghost">Fale Conosco</Button>
          </Link>
        </div>
        
        <Button>Login</Button>
      </div>
    </nav>
  );
};
