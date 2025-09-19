"use client";

import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import Image from 'next/image';

export const ContactForm = () => {
  return (
    <div className="bg-white lg:p-4 rounded-lg shadow-md max-w-md lg:max-w-lg mx-auto border border-gray-200">
      <div className="mb-6">
        <Image src="/imgs/GG-PRETOHORIZONTAL.png" alt="Contact Us" width={200} height={200} className="mx-auto mb-6" />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fale Conosco</h2>
      <p className="text-gray-600 text-center mb-6">
        Se você tiver alguma dúvida ou sugestão, entre em contato conosco.
      </p>
      
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
          <Input 
            type="text" 
            id="subject" 
            name="subject" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
          <Textarea 
            id="message" 
            name="message" 
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></Textarea>
        </div>
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enviar Mensagem
          </Button>
        </div>
      </form>
    </div>
  );
};
