"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormInterface, FormElement } from "@/interfaces/Form.interface";

interface FormContextType {
  elements: FormElement[];
  form: FormInterface
  selectedUuid: string | null;
  addElement: (type: FormElement["type"]) => void;
  selectElement: (uuid: string) => void;
  updateElement: (uuid: string, updates: Partial<FormElement>) => void;
  removeElement: (uuid: string) => void;
  moveElement: (uuid: string, dir: "up" | "down") => void;
  saveToLocalStorage: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("FormContext not found");
  return ctx;
};

interface FormProviderProps {
  children: ReactNode;
  form: FormInterface;
}

export const FormProvider = ({ children, form }: FormProviderProps) => {
  const [elements, setElements] = useState<FormElement[]>(form.elements || []);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  // Sync elements when form prop changes
  useEffect(() => {
    setElements(form.elements || []);
  }, [form]);

  // Save manually to localStorage
  const saveToLocalStorage = () => {
    // On clone les éléments et on enlève juste la ref (sinon JSON.stringify plante)
    const cleanedElements = elements.map(el => {
      if ('ref' in el) {
        const { ref, ...rest } = el;
        return rest;
      }
      return el;
    });

    const updatedForm: FormInterface = { ...form, elements: cleanedElements };
    const forms: FormInterface[] = JSON.parse(localStorage.getItem("forms") || "[]");
    const updatedForms = forms.map((f) => (f.uuid === form.uuid ? updatedForm : f));
    localStorage.setItem("forms", JSON.stringify(updatedForms));
  };

  const addElement = (type: FormElement["type"]) => {
    const uuid = uuidv4();
    const nextOrder = elements.length > 0 ? Math.max(...elements.map((e) => e.order)) + 1 : 1;

    let newElement: FormElement;

    if (type === "date") {
      newElement = { uuid, type: "date", label: "Date", name: "", required: false, order: nextOrder };
    } else if (type === "email") {
      newElement = {
        uuid,
        type: "email",
        label: "Email",
        name: "email",
        placeholder: "exemple@domaine.com",
        required: false,
        order: nextOrder
      };
    } else if (type === "number") {
      newElement = {
        uuid,
        type: "number",
        label: "Nombre",
        name: "",
        placeholder: "Entrez un nombre",
        required: false,
        order: nextOrder,
        min: undefined,
        max: undefined,
      };
    } else if (type === "fieldset") {
      newElement = {
        uuid,
        type: "fieldset",
        label: "Groupe de champs",
        name: "groupe_de_champs",
        order: nextOrder,
        children: [],
      };
    } else if (type === "select") {
      newElement = {
        uuid,
        type: "select",
        label: "Sélection",
        name: "selection",
        placeholder: `Veuillez selectionnez une ${type}`,
        required: false,
        multiple: false,
        options: [{ label: "Option 1", value: "option_1" }],//Default
        order: nextOrder,
      };
    } else if (type === "checkbox") {
      newElement = {
        uuid,
        type: "checkbox",
        label: "Checkbox Group",
        name: "checkbox_group",
        required: false,
        options: [{ label: "Option 1", value: "option_1" }],//Default
        orientation: "vertical",
        order: nextOrder,
      };
    } else if (type === "radio") {
      newElement = {
        uuid,
        type: "radio",
        label: "Radio Group",
        name: "radio_group",
        required: false,
        options: [
          { label: "Option 1", value: "option_1" },
          { label: "Option 2", value: "option_2" }
        ],
        orientation: "vertical",
        order: nextOrder,
      };
    } else if (type === "time") {
      newElement = {
        uuid,
        type: "time",
        label: "Heure",
        name: "heure",
        required: false,
        order: nextOrder,
      };
    } else if (type === "switch") {
      newElement = {
        uuid,
        type: "switch",
        label: "Interrupteur",
        name: "interrupteur",
        checkedChildren: 'Oui',
        unCheckedChildren: 'Non',
        required: false,
        order: nextOrder,
      };
    } else if (type === "phone") {
      newElement = {
        uuid,
        type: "phone",
        label: "Téléphone",
        name: "telephone",
        placeholder: "Ex: +261...",
        required: false,
        max: 10,
        order: nextOrder,
      };
    } else if (type === "head") {
      newElement = {
        uuid,
        type: "head",
        title: "Titre",
        description: "Sous titre",
        align: "left",
        label: '',
        order: nextOrder,
      };
    } else if (type === "divider") {
      newElement = {
        uuid,
        type: "divider",
        label: "",
        order: nextOrder,
      };
    } else if (type === "file") {
      newElement = {
        uuid,
        type: "file",
        label: "Fichier",
        name: "fichier",
        required: false,
        order: nextOrder,
      };
    } else if (type === "image") {
      newElement = {
        uuid,
        type: "image",
        label: "Image",
        name: "image",
        required: false,
        order: nextOrder,
      };
    } else if (type === "submit") {
      newElement = {
        uuid,
        type: "submit",
        label: "",
        name: "submit",
        buttonText: "Soumettre",
        order: nextOrder,
      };
    } else {
      newElement = { uuid, type, label: `New ${type}`, name: `new_${type}`, required: false, order: nextOrder };
    }

    setElements((prev) => [...prev, newElement]);
    setSelectedUuid(uuid);
  };

  const selectElement = (uuid: string) => {
    setSelectedUuid(uuid);
  };

  const updateElement = (uuid: string, updates: Partial<FormElement>) => {
    setElements((prev) => prev.map((el) => (el.uuid === uuid ? { ...el, ...updates } : el)));
  };

  const removeElement = (uuid: string) => {
    setElements((prev) => prev.filter((el) => el.uuid !== uuid));
    if (selectedUuid === uuid) setSelectedUuid(null);
  };

  const moveElement = (uuid: string, direction: "up" | "down") => {
    setElements((prev) => {
      const current = prev.find((el) => el.uuid === uuid);
      if (!current) return prev;

      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((el) => el.uuid === uuid);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= sorted.length) return prev;

      const other = sorted[targetIndex];

      return prev.map((el) => {
        if (el.uuid === current.uuid) return { ...el, order: other.order };
        if (el.uuid === other.uuid) return { ...el, order: current.order };
        return el;
      });
    });
  };

  return (
    <FormContext.Provider
      value={{
        elements,
        form,
        selectedUuid,
        addElement,
        selectElement,
        updateElement,
        removeElement,
        moveElement,
        saveToLocalStorage,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
