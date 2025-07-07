"use client";
import { Input, Checkbox } from "antd";
import { useFormContext } from "@/context/FormContext";

export default function PropertiesPanel() {
  const { elements, selectedUuid, updateElement } = useFormContext();

  const selected = elements.find((el) => el.uuid === selectedUuid);
  if (!selected) return <div className="text-gray-500">Aucun élément sélectionné</div>;

  return (
    <div className="space-y-2 p-4 bg-white shadow rounded">
      <h2 className="font-bold">Propriétés</h2>
      {selected.type === "sex" ? (
        <div className="text-gray-500">Aucune propriété modifiable pour ce champ.</div>
      ) : (
        <div>
          <Input
            addonBefore="Label"
            value={selected.label}
            onChange={(e) => updateElement(selected.uuid, { label: e.target.value })}
          />
          <Input
            className="mt-2"
            addonBefore="Name"
            value={selected.name}
            onChange={(e) => updateElement(selected.uuid, { name: e.target.value })}
          />
          {selected.type === "number" && (
              <div>
                <Input
                  className="mt-2"
                  addonBefore="Min"
                  type="number"
                  value={selected.min ?? ""}
                  onChange={(e) =>
                    updateElement(selected.uuid, {
                      min: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  className="mt-2"
                  addonBefore="Max"
                  type="number"
                  value={selected.max ?? ""}
                  onChange={(e) =>
                    updateElement(selected.uuid, {
                      max: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
          )}
      </div>
              )}
              {selected.type !== "checkbox" && selected.type !== "sex" && (
                <Input
                  addonBefore="Placeholder"
                  value={selected.placeholder}
                  onChange={(e) => updateElement(selected.uuid, {placeholder: e.target.value})}
                />
              )}
              {selected.type !== "sex" && (
                <Checkbox
                  checked={selected.required}
                  onChange={(e) => updateElement(selected.uuid, {required: e.target.checked})}
                >
                  Requis
                </Checkbox>
              )}
            </div>
          );
}
