"use client";

import React from 'react';
import Image from 'next/image';

// Componentes
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Label } from './ui/label';

export const ContactForm = () => {
  return (
    <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <CardHeader className="text-center">
        <Image
          src="/imgs/GG-PRETOHORIZONTAL.png"
          alt="Contact Us"
          width={150}
          height={150}
          className="mx-auto"
        />
        <CardTitle className="text-xl lg:text-2xl font-bold text-gray-800">Fale Conosco</CardTitle>
        <CardDescription className="text-gray-600 text-sm lg:text-base">
          Se você tiver alguma dúvida ou sugestão, entre em contato conosco.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Seu nome"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Sua mensagem..."
            ></Textarea>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400">
          Enviar Mensagem
        </Button>
      </CardFooter>
    </Card>
  );
};

