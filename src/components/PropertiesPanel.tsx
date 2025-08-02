"use client";

import {Input, Checkbox, Card} from "antd";
import { useFormContext } from "@/context/FormContext";
import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

// Utility function to normalize the label into a valid name property
function generateNameFromLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")                   // Normalize accents (é -> e)
    .replace(/[\u0300-\u036f]/g, "")   // Remove accents
    .replace(/[^a-z0-9 ]/gi, "")       // Remove special characters (like (, é, !, etc.)
    .trim()
    .replace(/\s+/g, "_");             // Replace spaces with underscores
}

export default function PropertiesPanel() {
  const { elements, selectedUuid, updateElement } = useFormContext();
  const selected = elements.find((el) => el.uuid === selectedUuid);

  const [label, setLabel] = useState("");

  // Sync local label state when selected element changes
  useEffect(() => {
    if (selected) {
      setLabel(selected.label || "");
    }
  }, [selected, selectedUuid]);

  // Update label and generate name automatically
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    const newName = generateNameFromLabel(newLabel);
    updateElement(selected!.uuid, {
      label: newLabel,
      name: newName,
    });
  };

  if (!selected) return <div className="text-gray-500">Aucun élément sélectionné</div>;

  return (
    <Card variant="outlined" title={<Title level={5}>Propriétés</Title>} className="space-y-2 p-4 shadow rounded">
      <h2 className="font-bold"></h2>

      {/* If type is "sex", show read-only message */}
      {selected.type === "sex" ? (
        <div className="text-gray-500">Aucune propriété modifiable pour ce champ.</div>
      ) : (
        <div>
          {/* Label input (triggers name update) */}
          <Input
            className="mt-2"
            addonBefore="Label"
            value={label}
            onChange={handleLabelChange}
          />

          {/* Name is auto-generated from label, and read-only */}
          <Input
            className="mt-2"
            addonBefore="Name"
            value={selected.name}
            disabled
          />

          {/* If the field is a number, show min and max inputs */}
          {selected.type === "number" && (
            <>
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
            </>
          )}
        </div>
      )}

      {/* Show placeholder if not checkbox or sex */}
      {selected.type !== "checkbox" && selected.type !== "sex" && (
        <Input
          className="mt-2"
          addonBefore="Placeholder"
          value={selected.placeholder}
          onChange={(e) => updateElement(selected.uuid, { placeholder: e.target.value })}
        />
      )}

      {/* Show "Requis" checkbox if not sex type */}
      {selected.type !== "sex" && (
        <Checkbox
          className="mt-2"
          checked={selected.required}
          onChange={(e) => updateElement(selected.uuid, { required: e.target.checked })}
        >
          Requis
        </Checkbox>
      )}
    </Card>
  );
}
