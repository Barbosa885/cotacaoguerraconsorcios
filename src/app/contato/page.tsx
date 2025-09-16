'use client'

import { ContactForm } from "~/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-4 bg-gray-50">
      <ContactForm />
    </div>
  );
}
