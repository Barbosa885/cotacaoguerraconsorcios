"use client";

import React from 'react';

export const ContactForm = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fale Conosco</h2>
      <p className="text-gray-600 text-center mb-6">
        Se você tiver alguma dúvida ou sugestão, entre em contato conosco.
      </p>
      
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
          <textarea 
            id="message" 
            name="message" 
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enviar Mensagem
          </button>
        </div>
      </form>
    </div>
  );
};
