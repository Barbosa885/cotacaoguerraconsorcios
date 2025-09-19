import { ContactForm } from "~/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-blue-200 via-white to-gray-300 flex flex-col items-center justify-center h-screen w-screen p-4 bg-blue-700">
      <ContactForm />
    </div>
  );
}
