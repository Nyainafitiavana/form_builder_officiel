"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormInterface } from "@/interfaces/Form.interface";
import { FormProvider } from "@/context/FormContext";
import Toolbox from "@/components/Toolbox";
import FormCanvas from "@/components/FormCanvas";
import PropertiesPanel from "@/components/PropertiesPanel";

export default function BuilderPageClient({ uuid }: { uuid: string }) {
  const [form, setForm] = useState<FormInterface | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!uuid) return;
    const forms: FormInterface[] = JSON.parse(localStorage.getItem("forms") || "[]");
    const currentForm = forms.find((f) => f.uuid === uuid);
    if (!currentForm) {
      alert("Formulaire non trouvé");
      router.push("/");
      return;
    }
    setForm(currentForm);
  }, [uuid, router]);

  if (!form) return <div>Chargement...</div>;

  return (
    <FormProvider form={form}>
      <div className="min-h-screen p-6 bg-gray-50 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1"><Toolbox /></div>
        <div className="lg:col-span-3"><FormCanvas /></div>
        <div className="lg:col-span-1"><PropertiesPanel /></div>
      </div>
    </FormProvider>
  );
}
