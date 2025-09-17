import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "~/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

// Define o schema de validação do formulário utilizando o Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Número de telefone inválido." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  interest: z.string().min(1, { message: "Selecione uma opção." }),
});

export const FinancingContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Valida o formulário com o schema do Zod
    const result = formSchema.safeParse(formData);
    
    if (result.success) {
      setErrors({});
      toast.success("Seu contato foi enviado com sucesso!", {
        description: "Um de nossos consultores entrará em contato em breve.",
      });
      // Limpa os campos do formulário após o envio
      setFormData({ name: "", phone: "", email: "", interest: "" });
    } else {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      toast.error("Por favor, preencha todos os campos corretamente.", {
        description: "Verifique os campos em vermelho.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Formatação do telefone
    if (id === 'phone') {
      let formattedValue = value.replace(/\D/g, "");
      formattedValue = formattedValue.replace(/^(\d{2})(\d)/g, "($1) $2");
      formattedValue = formattedValue.replace(/(\d)(\d{4})$/, "$1-$2");
      setFormData({ ...formData, [id]: formattedValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, interest: value });
  };
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center mb-4">
        <Image
          src="/imgs/GG-PRETO.png"
          alt="Grupo Guerra Logo"
          width={150}
          height={50}
        />
      </div>
      <h3 className="text-xl font-bold text-center">Fale com um consultor</h3>
      <p className="text-sm text-center text-gray-600">
        Preencha seus dados para receber uma simulação completa e falar com um especialista.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="Seu nome" 
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="(00) 90000-0000" 
            className={`mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`} 
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="seuemail@exemplo.com" 
            className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} 
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="interest">Estou interessado em:</Label>
          <Select onValueChange={handleSelectChange} value={formData.interest}>
            <SelectTrigger className={`mt-1 ${errors.interest ? 'border-red-500 focus:ring-red-500' : ''}`}>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consorcio">Consórcio de veículo</SelectItem>
              <SelectItem value="financiamento">Financiamento de veículo</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.interest && <p className="text-red-500 text-sm mt-1">{errors.interest}</p>}
        </div>
        
        <Button type="submit" className="w-full">
          Falar com um consultor
        </Button>
      </form>
    </div>
  );
};
