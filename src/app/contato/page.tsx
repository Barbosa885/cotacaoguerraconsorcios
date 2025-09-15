import { ContactForm } from "~/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Contato</h1>
      <p className="text-center mb-4">Entre em contato conosco para mais informações.</p>
      <ContactForm />
    </main>
  );
}
