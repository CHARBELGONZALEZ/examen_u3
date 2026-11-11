import RegistroForm from "@/components/RegistroForm";

export const metadata = {
  title: "Crear cuenta",
};

export default function Registro() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <RegistroForm />
    </main>
  );
}
