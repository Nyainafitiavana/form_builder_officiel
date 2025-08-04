import {Input, Checkbox, Card, Button, Switch} from "antd";
import {useFormContext} from "@/context/FormContext";
import React, {useEffect, useState} from "react";
import Title from "antd/es/typography/Title";
import {DeleteOutlined} from "@ant-design/icons";

function generateNameFromLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/gi, "")
    .trim()
    .replace(/\s+/g, "_");
}

export default function PropertiesPanel() {
  const {elements, selectedUuid, updateElement} = useFormContext();
  const selected = elements.find((el) => el.uuid === selectedUuid);

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selected) setLabel(selected.label || "");
  }, [selected, selectedUuid]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateElement(selected!.uuid, {
      label: newLabel,
      name: generateNameFromLabel(newLabel),
    });
  };

  const handleOptionChange = (index: number, key: "label" | "value", value: string) => {
    const updatedOptions = [...(selected?.options || [])];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [key]: value,
    };
    updateElement(selected!.uuid, {options: updatedOptions});
  };

  const handleAddOption = () => {
    const newOption = {label: "Option", value: "option"};
    updateElement(selected!.uuid, {
      options: [...(selected?.options || []), newOption],
    });
  };

  const handleRemoveOption = (index: number) => {
    const updated = [...(selected?.options || [])].filter((_, i) => i !== index);
    updateElement(selected!.uuid, {options: updated});
  };

  if (!selected) return <Card className="text-gray-500 min-h-[800px]">Aucun élément sélectionné</Card>;

  return (
    <Card
      variant="outlined"
      title={<Title level={5}>Propriétés</Title>}
      className="space-y-2 rounded shadow p-4 overflow-y-auto min-h-[300px] md:min-h-[400px] lg:min-h-[800px] max-h-[80vh]"
    >
      <div>
        <Input className="mt-4" addonBefore="Label" value={label} onChange={handleLabelChange}/>
        <Input className="mt-4" addonBefore="Name" value={selected.name} disabled/>

        {selected.type === "number" && (
          <>
            <Input
              className="mt-4"
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
              className="mt-4"
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

        {["select", "checkbox", "radio"].includes(selected.type) && (
          <div className="mt-4">
            <label className="block font-medium mb-1">Options</label>
            <div className="space-y-2">
              {(selected.options || []).map((opt: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <Input
                    addonBefore="Label"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  />
                  <Input
                    addonBefore="Value"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  />
                  <Button
                    icon={<DeleteOutlined/>}
                    danger
                    size="small"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={handleAddOption}>
                + Ajouter une option
              </Button>
            </div>

            {selected.type !== "select" && (
              <div className="mt-4">
                <h3 className="font-semibold">Orientation </h3>
                <Switch
                  checked={selected.orientation !== "horizontal"}
                  onChange={(checked) =>
                    updateElement(selected.uuid, {
                      orientation: checked ? "vertical" : "horizontal",
                    })
                  }
                  checkedChildren="Vertical"
                  unCheckedChildren="Horizontal"
                />
              </div>
            )}

            {selected.type === "select" && (
              <div className="mt-4">
                <Checkbox
                  checked={selected.multiple}
                  onChange={(e) =>
                    updateElement(selected.uuid, {
                      multiple: e.target.checked,
                    })
                  }
                >
                  Autoriser la sélection multiple
                </Checkbox>
                <div className="mt-2">
                  <Switch
                    checked={selected.orientation === "horizontal"}
                    onChange={(checked) =>
                      updateElement(selected.uuid, {
                        orientation: checked ? "horizontal" : "vertical",
                      })
                    }
                    checkedChildren="Horizontal"
                    unCheckedChildren="Vertical"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {selected.type !== "checkbox" && selected.type !== "radio" && (
          <Input
            className="mt-4"
            addonBefore="Placeholder"
            value={selected.placeholder}
            onChange={(e) =>
              updateElement(selected.uuid, {
                placeholder: e.target.value,
              })
            }
          />
        )}


        <div className="mt-4">
          <Checkbox
            checked={selected.required}
            onChange={(e) =>
              updateElement(selected.uuid, {
                required: e.target.checked,
              })
            }
          >
            Requis
          </Checkbox>
        </div>
      </div>
    </Card>
  );
}
