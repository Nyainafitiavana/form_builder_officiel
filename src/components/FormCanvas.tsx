"use client";

import { useFormContext } from "@/context/FormContext";
import FormLabel from "@/components/FormLabel";
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import {Button, Modal} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function FormCanvas() {
  const {
    elements,
    selectedUuid,
    selectElement,
    removeElement,
    moveElement,
    saveToLocalStorage,
  } = useFormContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const handleSaveConfirmed = () => {
    saveToLocalStorage(); // call of context method
    setShowConfirmModal(false);
    router.push("/"); // redirect to from list
  };

  return (
    <div className="bg-gray-100 min-h-[400px] p-4 rounded shadow-inner">
      {[...elements]
        .sort((a, b) => a.order - b.order)
        .map((el, index) => (
          <div
            key={el.uuid}
            onClick={() => selectElement(el.uuid)}
            className={`relative pt-6 p-2 border mb-4 cursor-pointer rounded ${
              selectedUuid === el.uuid ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {/* Boutons de contrôle (en haut à droite) */}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveElement(el.uuid, "up");
                }}
                disabled={index === 0}
                title="Monter"
                className="rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed p-1"
              >
                <ArrowUpOutlined />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveElement(el.uuid, "down");
                }}
                disabled={index === elements.length - 1}
                title="Descendre"
                className="rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed p-1"
              >
                <ArrowDownOutlined />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(el.uuid);
                }}
                title="Supprimer"
                className="rounded-full bg-red-500 hover:bg-red-600 p-1 text-white"
              >
                <DeleteOutlined style={{ color: "white" }} />
              </button>
            </div>

            {/* Rendu des champs */}
            {el.type === "input" && (
              <div>
                <FormLabel label={el.label} required={el.required} />
                <input
                  className="w-full border px-2 py-1"
                  name={el.name}
                  placeholder={el.placeholder}
                  required={el.required}
                />
              </div>
            )}

            {el.type === "textarea" && (
              <div>
                <FormLabel label={el.label} required={el.required} />
                <textarea
                  className="w-full border px-2 py-1"
                  name={el.name}
                  placeholder={el.placeholder}
                  required={el.required}
                />
              </div>
            )}

            {el.type === "checkbox" && (
              <div>
                <FormLabel label={el.label} required={el.required} />
                <input type="checkbox" name={el.name} required={el.required} />
              </div>
            )}

            {el.type === "sex" && (
              <div className="mb-2">
                <FormLabel label={el.label} required={el.required} />
                <div className="space-y-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={el.name}
                      value="Masculin"
                      className="mr-2"
                      required={el.required}
                    />
                    Masculin
                  </label>
                  <label className="inline-flex items-center ml-2">
                    <input
                      type="radio"
                      name={el.name}
                      value="Féminin"
                      className="mr-2"
                      required={el.required}
                    />
                    Féminin
                  </label>
                </div>
              </div>
            )}

            {el.type === "date" && (
              <div>
                <FormLabel label={el.label} required={el.required} />
                <input
                  type="date"
                  name={el.name}
                  className="w-full border px-2 py-1"
                  required={el.required}
                />
              </div>
            )}

            {el.type === "number" && (
              <div>
                <FormLabel label={el.label} required={el.required} />
                <input
                  type="number"
                  name={el.name}
                  placeholder={el.placeholder}
                  className="w-full border px-2 py-1"
                  required={el.required}
                  min={el.min}
                  max={el.max}
                />
              </div>
            )}
          </div>
        ))}
      {/* Bouton Sauvegarder */}
      <div className="flex justify-end mt-4">
        <Button type="primary" onClick={() => setShowConfirmModal(true)}>
          Sauvegarder
        </Button>
      </div>

      {/* Modal de confirmation */}
      <Modal
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onOk={handleSaveConfirmed}
        okText="Oui, sauvegarder"
        cancelText="Annuler"
        title="Confirmation"
      >
        <p>Voulez-vous vraiment sauvegarder ce formulaire ?</p>
      </Modal>
    </div>
  );
}
