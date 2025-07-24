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

  // Load form from localStorage
  useEffect(() => {
    const forms: FormInterface[] = JSON.parse(localStorage.getItem("forms") || "[]");
    const found = forms.find((f) => f.uuid === uuid);
    if (!found) {
      alert("Form not found");
      router.push("/");
    } else {
      setForm(found);
    }
  }, [uuid, router]);

  if (!form) return <div>Loading...</div>;

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
