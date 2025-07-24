"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {FormInterface} from "@/interfaces/Form.interface";
import {FormCard} from "@/components/FormCard";

function getForms(): FormInterface[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("forms") || "[]");
}

function saveForms(forms: FormInterface[]) {
  localStorage.setItem("forms", JSON.stringify(forms));
}

export default function FormListPage() {
  const [forms, setForms] = useState<FormInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setForms(getForms());
  }, []);

  const handleOpenModal = () => {
    setFormName("");
    setFormDesc("");
    setShowValidation(false);
    setIsModalOpen(true);
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      setShowValidation(true);
      message.error("Le titre est requis !");
      return;
    }

    const uuid = uuidv4();
    const newForm: FormInterface = {
      uuid,
      name: formName.trim(),
      description: formDesc.trim(),
      elements: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...forms, newForm];
    saveForms(updated);
    setForms(updated);
    setIsModalOpen(false);
    router.push(`/builder/${uuid}`);
  };

  const handleUpdate = (updatedForm: FormInterface) => {
    const updated = forms.map((f) =>
      f.uuid === updatedForm.uuid ? updatedForm : f
    );
    setForms(updated);
    saveForms(updated);
  };

  const handleDelete = async (uuid: string) => {
    Modal.confirm({
      title: "Supprimer ce formulaire ?",
      content: "Cette action est irréversible.",
      okText: "Supprimer",
      okButtonProps: { danger: true },
      cancelText: "Annuler",
      onOk: () => {
        const updated = forms.filter((f) => f.uuid !== uuid);
        setForms(updated);
        saveForms(updated);
        message.success("Formulaire supprimé.");
      },
    });
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mes Formulaires</h1>
        <Button type="primary" onClick={handleOpenModal}>
          Créer un formulaire
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {forms.map((form) => (
          <FormCard
            key={form.uuid}
            form={form}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        title="Créer un formulaire"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
        okText="Créer"
        cancelText="Annuler"
      >
        <div>
          <div className="mb-4">
            <Input
              placeholder="Titre du formulaire"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              status={showValidation && !formName.trim() ? "error" : ""}
            />
          </div>
          <div>
            <Input.TextArea
              rows={3}
              placeholder="Description (facultative)"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
